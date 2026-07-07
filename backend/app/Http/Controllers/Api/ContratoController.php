<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrato;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContratoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $contratos = Contrato::query()
            ->with([
                'fornecedor:id,nome,cnpj',
                'orcamento' => function ($query) {
                    $query->select([
                        'id',
                        'ano',
                        'orgao_id',
                        'programa_id',
                        'acao_id',
                        'dotacao_atualizada',
                        'valor_empenhado',
                        'valor_pago',
                        'saldo',
                        'percentual_execucao',
                        'status',
                    ])->with([
                        'orgao:id,sigla,nome,status',
                        'programa:id,codigo,nome',
                        'acao:id,programa_id,codigo,nome',
                    ]);
                },
            ])
            ->when($request->filled('orgao_id'), function ($query) use ($request) {
                $query->whereHas('orcamento', function ($query) use ($request) {
                    $query->where('orgao_id', $request->integer('orgao_id'));
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->when($request->filled('fornecedor'), function ($query) use ($request) {
                $fornecedor = $request->string('fornecedor');

                $query->whereHas('fornecedor', function ($query) use ($fornecedor) {
                    $query->where('nome', 'like', "%{$fornecedor}%")
                        ->orWhere('cnpj', 'like', "%{$fornecedor}%");
                });
            })
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 15));

        return response()->json($contratos);
    }
}