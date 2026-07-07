<?php

namespace Database\Seeders;

use App\Models\Orcamento;
use App\Models\Revisao;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RevisaoSeeder extends Seeder
{
    public function run(): void
    {
        $usuario = User::updateOrCreate(
            ['email' => 'analista@seplag.rj.gov.br'],
            [
                'name' => 'Analista SEPLAG',
                'email' => 'analista@seplag.rj.gov.br',
                'password' => Hash::make('orcamento@2026'),
            ]
        );

        $orcamentos = Orcamento::inRandomOrder()
            ->limit(120)
            ->get();

        foreach ($orcamentos as $orcamento) {
            Revisao::create([
                'orcamento_id' => $orcamento->id,
                'user_id' => $usuario->id,
                'observacao' => fake()->randomElement([
                    'Registro revisado sem inconsistências adicionais.',
                    'Valores conferidos com base na execução informada.',
                    'Orçamento revisado pelo analista responsável.',
                    'Identificada necessidade de acompanhamento posterior.',
                    'Registro validado para fins de acompanhamento orçamentário.',
                    null,
                ]),
            ]);
        }
    }
}