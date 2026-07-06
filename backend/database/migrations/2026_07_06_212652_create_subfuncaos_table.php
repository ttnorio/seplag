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
    Schema::create('subfuncoes', function (Blueprint $table) {
        $table->id();

        $table->foreignId('funcao_id')
            ->constrained('funcoes')
            ->restrictOnDelete();

        $table->string('codigo', 20)->unique();
        $table->string('nome');

        $table->timestamps();

        $table->index('funcao_id');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subfuncaos');
    }
};
