<?php

namespace Database\Seeders;

use App\Models\Orgao;
use App\Models\UnidadeGestora;
use Illuminate\Database\Seeder;

class UnidadeGestoraSeeder extends Seeder
{
    public function run(): void
    {
        $orgaos = Orgao::all();

        foreach ($orgaos as $orgao) {
            for ($i = 1; $i <= 3; $i++) {
                UnidadeGestora::updateOrCreate(
                    [
                        'orgao_id' => $orgao->id,
                        'nome' => "Unidade Gestora {$i} - {$orgao->sigla}",
                    ],
                    [
                        'orgao_id' => $orgao->id,
                        'nome' => "Unidade Gestora {$i} - {$orgao->sigla}",
                    ]
                );
            }
        }
    }
}