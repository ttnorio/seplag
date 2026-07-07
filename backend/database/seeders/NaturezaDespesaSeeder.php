<?php

namespace Database\Seeders;

use App\Models\NaturezaDespesa;
use Illuminate\Database\Seeder;

class NaturezaDespesaSeeder extends Seeder
{
    public function run(): void
    {
        $naturezas = json_decode(
            file_get_contents(database_path('data/natureza_despesas.json')),
            true
        );

        foreach ($naturezas as $natureza) {
            NaturezaDespesa::updateOrCreate(
                ['codigo' => $natureza['codigo']],
                $natureza
            );
        }
    }
}