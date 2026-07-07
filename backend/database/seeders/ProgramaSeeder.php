<?php

namespace Database\Seeders;

use App\Models\Programa;
use Illuminate\Database\Seeder;

class ProgramaSeeder extends Seeder
{
    public function run(): void
    {
        $programas = json_decode(
            file_get_contents(database_path('data/programas.json')),
            true
        );

        foreach ($programas as $programa) {
            Programa::updateOrCreate(
                ['codigo' => $programa['codigo']],
                $programa
            );
        }
    }
}