<?php

namespace Database\Seeders;

use App\Models\Contrato;
use App\Models\Fornecedor;
use App\Models\Orcamento;
use Illuminate\Database\Seeder;

class ContratoSeeder extends Seeder
{
    public function run(): void
    {
        $fornecedores = Fornecedor::all();

        $objetos = [
            'Prestação de serviços administrativos',
            'Aquisição de materiais de consumo',
            'Reforma de unidades públicas',
            'Manutenção predial preventiva e corretiva',
            'Fornecimento de equipamentos permanentes',
            'Serviços de tecnologia da informação',
            'Aquisição de medicamentos e insumos hospitalares',
            'Serviços de limpeza e conservação',
            'Serviços de vigilância patrimonial',
            'Execução de obras de infraestrutura',
            'Fornecimento de alimentação institucional',
            'Capacitação de servidores públicos',
            'Modernização de sistemas corporativos',
            'Manutenção de veículos oficiais',
            'Apoio operacional a unidades administrativas',
        ];

        $orcamentos = Orcamento::inRandomOrder()
            ->limit(420)
            ->get();

        for ($i = 1; $i <= 300; $i++) {
            $orcamento = $orcamentos->random();
            $fornecedor = $fornecedores->random();

            $inicio = fake()->dateTimeBetween('-18 months', '+3 months');
            $fim = (clone $inicio)->modify('+' . random_int(3, 24) . ' months');

            $status = $this->definirStatus($fim);

            Contrato::create([
                'orcamento_id' => $orcamento->id,
                'fornecedor_id' => $fornecedor->id,
                'numero_contrato' => str_pad((string) $i, 3, '0', STR_PAD_LEFT) . '/2026',
                'objeto' => fake()->randomElement($objetos),
                'valor' => $this->valorContrato($orcamento),
                'inicio_vigencia' => $inicio->format('Y-m-d'),
                'fim_vigencia' => $fim->format('Y-m-d'),
                'status' => $status,
            ]);
        }
    }

    private function definirStatus(\DateTimeInterface $fim): string
    {
        if (random_int(1, 100) <= 10) {
            return 'suspenso';
        }

        if (random_int(1, 100) <= 20) {
            return 'encerrado';
        }

        if ($fim < now()) {
            return 'vencido';
        }

        return 'vigente';
    }

    private function valorContrato(Orcamento $orcamento): float
    {
        $base = $orcamento->dotacao_atualizada ?? 500000;

        $percentual = random_int(5, 35);

        return round(($base * $percentual) / 100, 2);
    }
}