<?php

namespace Database\Seeders;

use App\Models\Orgao;
use Illuminate\Database\Seeder;

class OrgaoSeeder extends Seeder
{
    public function run(): void
    {
        $orgaos = json_decode(
            file_get_contents(database_path('data/orgaos.json')),
            true
        );

        foreach ($orgaos as $orgao) {
            Orgao::updateOrCreate(
                ['sigla' => $orgao['sigla']],
                $orgao
            );
        }
    }
}