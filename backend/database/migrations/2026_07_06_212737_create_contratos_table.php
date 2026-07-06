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
    Schema::create('contratos', function (Blueprint $table) {
        $table->id();

        $table->foreignId('orcamento_id')
            ->constrained('orcamentos')
            ->restrictOnDelete();

        $table->foreignId('fornecedor_id')
            ->constrained('fornecedores')
            ->restrictOnDelete();

        $table->string('numero_contrato', 50)->unique();
        $table->text('objeto');

        $table->decimal('valor', 15, 2);

        $table->date('inicio_vigencia');
        $table->date('fim_vigencia');

        $table->enum('status', [
            'vigente',
            'encerrado',
            'suspenso',
            'vencido'
        ])->default('vigente');

        $table->timestamps();

        $table->index('status');
        $table->index('orcamento_id');
        $table->index('fornecedor_id');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
