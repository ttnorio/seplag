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
    Schema::create('orgaos', function (Blueprint $table) {
        $table->id();

        $table->string('sigla', 30)->unique();
        $table->string('nome');
        $table->enum('status', ['ativo', 'inativo'])->default('ativo');

        $table->timestamps();

        $table->index('status');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orgaos');
    }
};
