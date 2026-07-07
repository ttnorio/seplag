<?php

namespace Database\Seeders;

use App\Models\Acao;
use App\Models\Programa;
use Illuminate\Database\Seeder;

class AcaoSeeder extends Seeder
{
    public function run(): void
    {
        $acoesPorPrograma = [
            '001' => [
                'Manutenção administrativa',
                'Modernização da gestão pública',
                'Capacitação de servidores',
                'Gestão de sistemas corporativos',
                'Apoio operacional às unidades',
                'Planejamento e monitoramento institucional',
                'Gestão de contratos administrativos',
                'Melhoria de processos internos',
            ],
            '002' => [
                'Manutenção de unidades escolares',
                'Aquisição de material didático',
                'Reforma de escolas estaduais',
                'Capacitação de professores',
                'Transporte escolar',
                'Alimentação escolar',
                'Modernização de laboratórios',
                'Ampliação da educação técnica',
            ],
            '003' => [
                'Aquisição de medicamentos',
                'Reforma de hospitais',
                'Manutenção de unidades de saúde',
                'Contratação de serviços médicos',
                'Compra de equipamentos hospitalares',
                'Atenção básica em saúde',
                'Campanhas de vacinação',
                'Gestão de leitos hospitalares',
            ],
            '004' => [
                'Policiamento ostensivo',
                'Modernização de delegacias',
                'Aquisição de viaturas',
                'Capacitação de agentes de segurança',
                'Gestão de inteligência policial',
                'Manutenção de batalhões',
                'Compra de equipamentos de proteção',
                'Atendimento emergencial',
            ],
            '005' => [
                'Conservação de rodovias',
                'Construção de pontes',
                'Reforma de prédios públicos',
                'Drenagem urbana',
                'Pavimentação de vias',
                'Fiscalização de obras',
                'Manutenção de equipamentos urbanos',
                'Projetos de mobilidade',
            ],
            '006' => [
                'Fomento a pequenos negócios',
                'Apoio a polos industriais',
                'Promoção de investimentos',
                'Capacitação empreendedora',
                'Desenvolvimento regional',
                'Apoio à inovação produtiva',
                'Feiras e eventos econômicos',
                'Estudos de competitividade',
            ],
            '007' => [
                'Modernização de sistemas corporativos',
                'Infraestrutura de tecnologia',
                'Segurança da informação',
                'Digitalização de serviços públicos',
                'Desenvolvimento de plataformas digitais',
                'Aquisição de equipamentos de TI',
                'Integração de bases de dados',
                'Capacitação em tecnologia',
            ],
            '008' => [
                'Atendimento à população vulnerável',
                'Apoio a centros de assistência social',
                'Programas de transferência de renda',
                'Proteção a crianças e adolescentes',
                'Ações de direitos humanos',
                'Acolhimento institucional',
                'Distribuição de benefícios sociais',
                'Fortalecimento da rede socioassistencial',
            ],
            '009' => [
                'Preservação ambiental',
                'Fiscalização ambiental',
                'Recuperação de áreas degradadas',
                'Gestão de unidades de conservação',
                'Educação ambiental',
                'Monitoramento climático',
                'Controle de resíduos',
                'Licenciamento ambiental',
            ],
            '010' => [
                'Promoção turística',
                'Apoio a eventos culturais',
                'Revitalização de espaços turísticos',
                'Divulgação institucional do turismo',
                'Capacitação do setor turístico',
                'Apoio a municípios turísticos',
                'Manutenção de equipamentos culturais',
                'Mapeamento de rotas turísticas',
            ],
        ];

        foreach ($acoesPorPrograma as $codigoPrograma => $acoes) {
            $programa = Programa::where('codigo', $codigoPrograma)->firstOrFail();

            foreach ($acoes as $index => $nomeAcao) {
                Acao::updateOrCreate(
                    [
                        'codigo' => $codigoPrograma . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    ],
                    [
                        'programa_id' => $programa->id,
                        'codigo' => $codigoPrograma . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                        'nome' => $nomeAcao,
                    ]
                );
            }
        }
    }
}