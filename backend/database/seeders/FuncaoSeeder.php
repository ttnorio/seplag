<?php

namespace Database\Seeders;

use App\Models\Funcao;
use Illuminate\Database\Seeder;

class FuncaoSeeder extends Seeder
{
    public function run(): void
    {
        $funcoes = json_decode(
            file_get_contents(database_path('data/funcoes.json')),
            true
        );

        foreach ($funcoes as $funcao) {
            Funcao::updateOrCreate(
                ['codigo' => $funcao['codigo']],
                $funcao
            );
        }
    }
}