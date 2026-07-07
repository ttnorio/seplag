<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Orgao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrgaoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orgaos = Orgao::query()
            ->withCount([
                'unidadesGestoras',
                'orcamentos',
            ])
            ->when($request->filled('busca'), function ($query) use ($request) {
                $busca = $request->string('busca');

                $query->where(function ($query) use ($busca) {
                    $query->where('nome', 'like', "%{$busca}%")
                        ->orWhere('sigla', 'like', "%{$busca}%");
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->string('status'));
            })
            ->orderBy('nome')
            ->paginate($request->integer('per_page', 10));

        return response()->json($orgaos);
    }
}