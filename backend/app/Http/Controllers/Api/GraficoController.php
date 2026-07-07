<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use App\Models\Orcamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GraficoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'execucao_por_orgao' => $this->execucaoPorOrgao(),
            'execucao_por_programa' => $this->execucaoPorPrograma(),
            'empenhado_x_pago' => $this->empenhadoXPago(),
            'top_10_contratos' => $this->top10Contratos(),
            'evolucao_anual' => $this->evolucaoAnual(),
            'orcamentos_por_status' => $this->orcamentosPorStatus(),
            'contratos_por_status' => $this->contratosPorStatus(),
        ]);
    }

    private function execucaoPorOrgao()
    {
        return Orcamento::query()
            ->join('orgaos', 'orgaos.id', '=', 'orcamentos.orgao_id')
            ->select([
                'orgaos.id',
                'orgaos.sigla',
                'orgaos.nome',
                DB::raw('SUM(orcamentos.dotacao_atualizada) as dotacao_atualizada'),
                DB::raw('SUM(orcamentos.valor_empenhado) as valor_empenhado'),
                DB::raw('SUM(orcamentos.valor_pago) as valor_pago'),
                DB::raw("
                    CASE
                        WHEN SUM(orcamentos.dotacao_atualizada) > 0
                        THEN ROUND((SUM(orcamentos.valor_empenhado) / SUM(orcamentos.dotacao_atualizada)) * 100, 2)
                        ELSE 0
                    END as percentual_execucao
                "),
            ])
            ->groupBy('orgaos.id', 'orgaos.sigla', 'orgaos.nome')
            ->orderByDesc('dotacao_atualizada')
            ->get();
    }

    private function execucaoPorPrograma()
    {
        return Orcamento::query()
            ->join('programas', 'programas.id', '=', 'orcamentos.programa_id')
            ->select([
                'programas.id',
                'programas.codigo',
                'programas.nome',
                DB::raw('SUM(orcamentos.dotacao_atualizada) as dotacao_atualizada'),
                DB::raw('SUM(orcamentos.valor_empenhado) as valor_empenhado'),
                DB::raw('SUM(orcamentos.valor_pago) as valor_pago'),
                DB::raw("
                    CASE
                        WHEN SUM(orcamentos.dotacao_atualizada) > 0
                        THEN ROUND((SUM(orcamentos.valor_empenhado) / SUM(orcamentos.dotacao_atualizada)) * 100, 2)
                        ELSE 0
                    END as percentual_execucao
                "),
            ])
            ->groupBy('programas.id', 'programas.codigo', 'programas.nome')
            ->orderByDesc('valor_empenhado')
            ->get();
    }

    private function empenhadoXPago()
    {
        return Orcamento::query()
            ->select([
                DB::raw('SUM(valor_empenhado) as empenhado'),
                DB::raw('SUM(valor_liquidado) as liquidado'),
                DB::raw('SUM(valor_pago) as pago'),
            ])
            ->first();
    }

    private function top10Contratos()
    {
        return Contrato::query()
            ->with([
                'fornecedor:id,nome,cnpj',
                'orcamento:id,orgao_id,programa_id,acao_id',
                'orcamento.orgao:id,sigla,nome',
                'orcamento.programa:id,codigo,nome',
                'orcamento.acao:id,programa_id,codigo,nome',
            ])
            ->orderByDesc('valor')
            ->limit(10)
            ->get();
    }

    private function evolucaoAnual()
    {
        return Orcamento::query()
            ->select([
                'ano',
                DB::raw('SUM(dotacao_atualizada) as dotacao_atualizada'),
                DB::raw('SUM(valor_empenhado) as valor_empenhado'),
                DB::raw('SUM(valor_liquidado) as valor_liquidado'),
                DB::raw('SUM(valor_pago) as valor_pago'),
            ])
            ->groupBy('ano')
            ->orderBy('ano')
            ->get();
    }

    private function orcamentosPorStatus()
    {
        return Orcamento::query()
            ->select([
                'status',
                DB::raw('COUNT(*) as total'),
            ])
            ->groupBy('status')
            ->orderBy('status')
            ->get();
    }

    private function contratosPorStatus()
    {
        return Contrato::query()
            ->select([
                'status',
                DB::raw('COUNT(*) as total'),
            ])
            ->groupBy('status')
            ->orderBy('status')
            ->get();
    }
}