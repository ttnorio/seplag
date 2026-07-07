<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            OrgaoSeeder::class,
            ProgramaSeeder::class,
            FuncaoSeeder::class,
            SubfuncaoSeeder::class,
            NaturezaDespesaSeeder::class,
            FonteRecursoSeeder::class,
        ]);
    }
}