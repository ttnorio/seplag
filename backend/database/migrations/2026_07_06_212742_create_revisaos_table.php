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
    Schema::create('revisoes', function (Blueprint $table) {
        $table->id();

        $table->foreignId('orcamento_id')
            ->constrained('orcamentos')
            ->cascadeOnDelete();

        $table->foreignId('user_id')
            ->constrained('users')
            ->restrictOnDelete();

        $table->text('observacao')->nullable();

        $table->timestamps();

        $table->index('orcamento_id');
        $table->index('user_id');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revisaos');
    }
};
