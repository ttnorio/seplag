<?php

namespace Database\Seeders;

use App\Models\Funcao;
use App\Models\Subfuncao;
use Illuminate\Database\Seeder;

class SubfuncaoSeeder extends Seeder
{
    public function run(): void
    {
        $subfuncoes = json_decode(
            file_get_contents(database_path('data/subfuncoes.json')),
            true
        );

        foreach ($subfuncoes as $subfuncao) {
            $funcao = Funcao::where('codigo', $subfuncao['funcao_codigo'])->firstOrFail();

            Subfuncao::updateOrCreate(
                ['codigo' => $subfuncao['codigo']],
                [
                    'funcao_id' => $funcao->id,
                    'codigo' => $subfuncao['codigo'],
                    'nome' => $subfuncao['nome'],
                ]
            );
        }
    }
}