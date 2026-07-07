<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orcamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrcamentoController extends Controller
{
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
}