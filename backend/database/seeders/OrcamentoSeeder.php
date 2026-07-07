<?php

namespace Database\Seeders;

use App\Models\Acao;
use App\Models\FonteRecurso;
use App\Models\Funcao;
use App\Models\NaturezaDespesa;
use App\Models\Orcamento;
use App\Models\Orgao;
use App\Models\Subfuncao;
use App\Models\UnidadeGestora;
use Illuminate\Database\Seeder;

class OrcamentoSeeder extends Seeder
{
    public function run(): void
    {
        $orgaos = Orgao::where('status', 'ativo')->get();

        $naturezas = NaturezaDespesa::all();
        $fontes = FonteRecurso::all();

        for ($i = 1; $i <= 500; $i++) {
            $orgao = $orgaos->random();

            $unidadeGestora = UnidadeGestora::where('orgao_id', $orgao->id)
                ->inRandomOrder()
                ->first();

            $acao = Acao::with('programa')->inRandomOrder()->first();

            $funcao = Funcao::inRandomOrder()->first();

            $subfuncao = Subfuncao::where('funcao_id', $funcao->id)
                ->inRandomOrder()
                ->first();

            $natureza = $naturezas->random();
            $fonte = $fontes->random();

            $dotacaoInicial = $this->money(100000, 5000000);
            $suplementacoes = $this->money(0, 1000000);
            $anulacoes = $this->money(0, 600000);

            $dotacaoAtualizada = $dotacaoInicial + $suplementacoes - $anulacoes;

            $tipoCaso = $i % 100;

            if ($tipoCaso <= 10) {
                $valores = $this->semExecucao($dotacaoAtualizada);
            } elseif ($tipoCaso <= 20) {
                $valores = $this->saldoNegativo($dotacaoAtualizada);
            } elseif ($tipoCaso <= 30) {
                $valores = $this->inconsistente($dotacaoAtualizada);
            } elseif ($tipoCaso <= 45) {
                $valores = $this->executado($dotacaoAtualizada);
            } else {
                $valores = $this->emExecucao($dotacaoAtualizada);
            }

            Orcamento::create([
                'ano' => fake()->randomElement([2024, 2025, 2026]),

                'orgao_id' => $orgao->id,
                'unidade_gestora_id' => $unidadeGestora->id,
                'programa_id' => $acao->programa_id,
                'acao_id' => $acao->id,
                'funcao_id' => $funcao->id,
                'subfuncao_id' => $subfuncao->id,
                'natureza_despesa_id' => $natureza->id,
                'fonte_recurso_id' => $fonte->id,

                'dotacao_inicial' => $valores['dotacao_inicial'] ?? $dotacaoInicial,
                'suplementacoes' => $valores['suplementacoes'] ?? $suplementacoes,
                'anulacoes' => $valores['anulacoes'] ?? $anulacoes,
                'dotacao_atualizada' => $valores['dotacao_atualizada'] ?? $dotacaoAtualizada,

                'valor_empenhado' => $valores['valor_empenhado'],
                'valor_liquidado' => $valores['valor_liquidado'],
                'valor_pago' => $valores['valor_pago'],
                'saldo' => $valores['saldo'],
                'percentual_execucao' => $valores['percentual_execucao'],
                'status' => $valores['status'],
            ]);
        }
    }

    private function emExecucao(float $dotacaoAtualizada): array
    {
        $valorEmpenhado = $this->percentual($dotacaoAtualizada, random_int(15, 85));
        $valorLiquidado = $this->percentual($valorEmpenhado, random_int(40, 95));
        $valorPago = $this->percentual($valorLiquidado, random_int(30, 95));

        return $this->montarValores(
            $dotacaoAtualizada,
            $valorEmpenhado,
            $valorLiquidado,
            $valorPago,
            'em_execucao'
        );
    }

    private function semExecucao(float $dotacaoAtualizada): array
    {
        return $this->montarValores(
            $dotacaoAtualizada,
            0,
            0,
            0,
            'sem_execucao'
        );
    }

    private function executado(float $dotacaoAtualizada): array
    {
        $valorEmpenhado = $this->percentual($dotacaoAtualizada, random_int(95, 100));
        $valorLiquidado = $this->percentual($valorEmpenhado, random_int(85, 100));
        $valorPago = $this->percentual($valorLiquidado, random_int(80, 100));

        return $this->montarValores(
            $dotacaoAtualizada,
            $valorEmpenhado,
            $valorLiquidado,
            $valorPago,
            'executado'
        );
    }

    private function saldoNegativo(float $dotacaoAtualizada): array
    {
        $valorEmpenhado = $this->percentual($dotacaoAtualizada, random_int(105, 130));
        $valorLiquidado = $this->percentual($valorEmpenhado, random_int(60, 95));
        $valorPago = $this->percentual($valorLiquidado, random_int(40, 95));

        return $this->montarValores(
            $dotacaoAtualizada,
            $valorEmpenhado,
            $valorLiquidado,
            $valorPago,
            'saldo_negativo'
        );
    }

    private function inconsistente(float $dotacaoAtualizada): array
    {
        $valorEmpenhado = $this->percentual($dotacaoAtualizada, random_int(20, 90));
        $valorLiquidado = $this->percentual($valorEmpenhado, random_int(20, 70));
        $valorPago = $valorLiquidado + $this->money(1000, 50000);

        $valores = $this->montarValores(
            $dotacaoAtualizada,
            $valorEmpenhado,
            $valorLiquidado,
            $valorPago,
            'inconsistente'
        );

        if (random_int(1, 4) === 1) {
            $valores['valor_liquidado'] = null;
            $valores['percentual_execucao'] = null;
        }

        return $valores;
    }

    private function montarValores(
        float $dotacaoAtualizada,
        ?float $valorEmpenhado,
        ?float $valorLiquidado,
        ?float $valorPago,
        string $status
    ): array {
        $saldo = $valorEmpenhado === null
            ? null
            : round($dotacaoAtualizada - $valorEmpenhado, 2);

        $percentualExecucao = $valorEmpenhado === null || $dotacaoAtualizada <= 0
            ? null
            : round(($valorEmpenhado / $dotacaoAtualizada) * 100, 2);

        return [
            'dotacao_atualizada' => round($dotacaoAtualizada, 2),
            'valor_empenhado' => $valorEmpenhado,
            'valor_liquidado' => $valorLiquidado,
            'valor_pago' => $valorPago,
            'saldo' => $saldo,
            'percentual_execucao' => $percentualExecucao,
            'status' => $status,
        ];
    }

    private function percentual(float $valor, int $percentual): float
    {
        return round(($valor * $percentual) / 100, 2);
    }

    private function money(int $min, int $max): float
    {
        return (float) random_int($min, $max);
    }
}