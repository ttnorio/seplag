<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContratoController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrcamentoController;
use App\Http\Controllers\Api\OrgaoController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/orgaos', [OrgaoController::class, 'index']);

Route::get('/orcamentos', [OrcamentoController::class, 'index']);
Route::get('/orcamentos/{id}', [OrcamentoController::class, 'show']);

Route::get('/contratos', [ContratoController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::patch('/orcamentos/{id}/revisao', [OrcamentoController::class, 'revisar']);
});