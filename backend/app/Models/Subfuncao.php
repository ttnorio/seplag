<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subfuncao extends Model
{
    protected $table = 'subfuncoes';

    protected $fillable = [
        'funcao_id',
        'codigo',
        'nome',
    ];

    public function funcao(): BelongsTo
    {
        return $this->belongsTo(Funcao::class);
    }

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}