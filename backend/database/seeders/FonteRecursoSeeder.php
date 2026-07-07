<?php

namespace Database\Seeders;

use App\Models\FonteRecurso;
use Illuminate\Database\Seeder;

class FonteRecursoSeeder extends Seeder
{
    public function run(): void
    {
        $fontes = json_decode(
            file_get_contents(database_path('data/fontes_recurso.json')),
            true
        );

        foreach ($fontes as $fonte) {
            FonteRecurso::updateOrCreate(
                ['codigo' => $fonte['codigo']],
                $fonte
            );
        }
    }
}