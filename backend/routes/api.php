<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrgaoController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/orgaos', [OrgaoController::class, 'index']);