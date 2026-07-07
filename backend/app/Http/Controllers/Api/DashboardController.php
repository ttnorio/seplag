<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use App\Models\Orcamento;
use App\Models\Orgao;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $orcamentos = Orcamento::query();

        $orcamentoTotal = (float) $orcamentos->sum('dotacao_atualizada');
        $empenhado = (float) Orcamento::sum('valor_empenhado');
        $liquidado = (float) Orcamento::sum('valor_liquidado');
        $pago = (float) Orcamento::sum('valor_pago');
        $saldo = (float) Orcamento::sum('saldo');

        $percentualExecucao = $orcamentoTotal > 0
            ? round(($empenhado / $orcamentoTotal) * 100, 2)
            : 0;

        return response()->json([
            'total_orgaos' => Orgao::count(),
            'total_orcamentos' => Orcamento::count(),
            'total_contratos' => Contrato::count(),

            'orcamento_total' => round($orcamentoTotal, 2),
            'empenhado' => round($empenhado, 2),
            'liquidado' => round($liquidado, 2),
            'pago' => round($pago, 2),
            'saldo' => round($saldo, 2),
            'percentual_execucao' => $percentualExecucao,

            'orcamentos_por_status' => Orcamento::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),

            'contratos_por_status' => Contrato::selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),

            'total_revisados' => Orcamento::whereHas('revisoes')->count(),
            'total_nao_revisados' => Orcamento::whereDoesntHave('revisoes')->count(),
        ]);
    }
}