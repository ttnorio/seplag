<?php

namespace Database\Seeders;

use App\Models\Fornecedor;
use Illuminate\Database\Seeder;

class FornecedorSeeder extends Seeder
{
    public function run(): void
    {
        $fornecedores = [
            ['nome' => 'Alpha Serviços de Engenharia Ltda.', 'cnpj' => '12.345.678/0001-90'],
            ['nome' => 'Beta Tecnologia e Sistemas S.A.', 'cnpj' => '23.456.789/0001-01'],
            ['nome' => 'Gamma Construções e Reformas Ltda.', 'cnpj' => '34.567.890/0001-12'],
            ['nome' => 'Delta Comércio de Materiais Ltda.', 'cnpj' => '45.678.901/0001-23'],
            ['nome' => 'Omega Consultoria Administrativa Ltda.', 'cnpj' => '56.789.012/0001-34'],
            ['nome' => 'RioMed Equipamentos Hospitalares Ltda.', 'cnpj' => '67.890.123/0001-45'],
            ['nome' => 'EducaMais Soluções Educacionais Ltda.', 'cnpj' => '78.901.234/0001-56'],
            ['nome' => 'Segurança Total Serviços Ltda.', 'cnpj' => '89.012.345/0001-67'],
            ['nome' => 'TransRio Logística e Transportes Ltda.', 'cnpj' => '90.123.456/0001-78'],
            ['nome' => 'InfraSul Obras Públicas Ltda.', 'cnpj' => '01.234.567/0001-89'],

            ['nome' => 'Norte Engenharia Civil Ltda.', 'cnpj' => '11.222.333/0001-44'],
            ['nome' => 'Carioca Serviços Terceirizados Ltda.', 'cnpj' => '22.333.444/0001-55'],
            ['nome' => 'Solução Pública Tecnologia Ltda.', 'cnpj' => '33.444.555/0001-66'],
            ['nome' => 'Vida Saúde Distribuidora Ltda.', 'cnpj' => '44.555.666/0001-77'],
            ['nome' => 'Escola Viva Materiais Didáticos Ltda.', 'cnpj' => '55.666.777/0001-88'],
            ['nome' => 'Construtora Atlântica Ltda.', 'cnpj' => '66.777.888/0001-99'],
            ['nome' => 'Urbaniza Rio Serviços Ltda.', 'cnpj' => '77.888.999/0001-00'],
            ['nome' => 'Ambiental Verde Consultoria Ltda.', 'cnpj' => '88.999.000/0001-11'],
            ['nome' => 'Prime Alimentação Corporativa Ltda.', 'cnpj' => '99.000.111/0001-22'],
            ['nome' => 'DataGov Sistemas Integrados Ltda.', 'cnpj' => '10.111.222/0001-33'],

            ['nome' => 'Fornecedor sem CNPJ Informado', 'cnpj' => null],
        ];

        foreach ($fornecedores as $fornecedor) {
            Fornecedor::updateOrCreate(
                ['nome' => $fornecedor['nome']],
                $fornecedor
            );
        }
    }
}