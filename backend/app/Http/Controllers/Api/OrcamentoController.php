<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orcamento;
use App\Models\Revisao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrcamentoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orcamentos = Orcamento::query()
            ->with([
                'orgao:id,sigla,nome,status',
                'unidadeGestora:id,nome,orgao_id',
                'programa:id,codigo,nome',
                'acao:id,programa_id,codigo,nome',
                'funcao:id,codigo,nome',
                'subfuncao:id,funcao_id,codigo,nome',
                'naturezaDespesa:id,codigo,descricao',
                'fonteRecurso:id,codigo,descricao',
            ])
            ->withCount([
                'contratos',
                'revisoes',
            ])
            ->when($request->filled('orgao_id'), function ($query) use ($request) {
                $query->where('orgao_id', $request->integer('orgao_id'));
            })
            ->when($request->filled('programa_id'), function ($query) use ($request) {
                $query->where('programa_id', $request->integer('programa_id'));
            })
            ->when($request->filled('acao_id'), function ($query) use ($request) {
                $query->where('acao_id', $request->integer('acao_id'));
            })
            ->when($request->filled('ano'), function ($query) use ($request) {
                $query->where('ano', $request->integer('ano'));
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->when($request->filled('percentual_min'), function ($query) use ($request) {
                $query->where('percentual_execucao', '>=', $request->float('percentual_min'));
            })
            ->when($request->filled('percentual_max'), function ($query) use ($request) {
                $query->where('percentual_execucao', '<=', $request->float('percentual_max'));
            })
            ->orderByDesc('ano')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 15));

        return response()->json($orcamentos);
    }

    public function show(int $id): JsonResponse
    {
        $orcamento = Orcamento::query()
            ->with([
                'orgao:id,sigla,nome,status',
                'unidadeGestora:id,nome,orgao_id',
                'programa:id,codigo,nome',
                'acao:id,programa_id,codigo,nome',
                'funcao:id,codigo,nome',
                'subfuncao:id,funcao_id,codigo,nome',
                'naturezaDespesa:id,codigo,descricao',
                'fonteRecurso:id,codigo,descricao',
                'contratos' => function ($query) {
                    $query->with('fornecedor:id,nome,cnpj')
                        ->orderByDesc('id');
                },
                'revisoes' => function ($query) {
                    $query->with('user:id,name,email')
                        ->orderByDesc('created_at');
                },
            ])
            ->findOrFail($id);

        return response()->json($orcamento);
    }

    public function revisar(Request $request, int $id): JsonResponse
    {
        $dados = $request->validate([
            'observacao' => ['nullable', 'string', 'max:1000'],
        ]);

        $orcamento = Orcamento::findOrFail($id);

        $revisao = Revisao::updateOrCreate(
            [
                'orcamento_id' => $orcamento->id,
                'user_id' => $request->user()->id,
            ],
            [
                'observacao' => $dados['observacao'] ?? null,
            ]
        );

        $revisao->load('user:id,name,email');

        return response()->json([
            'message' => 'Orçamento marcado como revisado.',
            'orcamento_id' => $orcamento->id,
            'revisao' => $revisao,
        ]);
    }
}