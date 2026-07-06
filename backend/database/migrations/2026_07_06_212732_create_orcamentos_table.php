<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('orcamentos', function (Blueprint $table) {
        $table->id();

        $table->unsignedSmallInteger('ano')->index();

        $table->foreignId('orgao_id')->constrained('orgaos')->restrictOnDelete();
        $table->foreignId('unidade_gestora_id')->constrained('unidades_gestoras')->restrictOnDelete();
        $table->foreignId('programa_id')->constrained('programas')->restrictOnDelete();
        $table->foreignId('acao_id')->constrained('acoes')->restrictOnDelete();
        $table->foreignId('funcao_id')->constrained('funcoes')->restrictOnDelete();
        $table->foreignId('subfuncao_id')->constrained('subfuncoes')->restrictOnDelete();
        $table->foreignId('natureza_despesa_id')->constrained('naturezas_despesa')->restrictOnDelete();
        $table->foreignId('fonte_recurso_id')->constrained('fontes_recurso')->restrictOnDelete();

        $table->decimal('dotacao_inicial', 15, 2)->nullable();
        $table->decimal('suplementacoes', 15, 2)->nullable();
        $table->decimal('anulacoes', 15, 2)->nullable();
        $table->decimal('dotacao_atualizada', 15, 2)->nullable();

        $table->decimal('valor_empenhado', 15, 2)->nullable();
        $table->decimal('valor_liquidado', 15, 2)->nullable();
        $table->decimal('valor_pago', 15, 2)->nullable();

        $table->decimal('saldo', 15, 2)->nullable();
        $table->decimal('percentual_execucao', 5, 2)->nullable();

        $table->enum('status', [
            'sem_execucao',
            'em_execucao',
            'executado',
            'saldo_negativo',
            'inconsistente',
        ])->default('em_execucao')->index();

        $table->timestamps();

        $table->index([
            'orgao_id',
            'programa_id',
            'acao_id',
            'ano',
            'status',
        ], 'orcamentos_filtros_index');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orcamentos');
    }
};
