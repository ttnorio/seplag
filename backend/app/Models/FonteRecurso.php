<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FonteRecurso extends Model
{
    protected $table = 'fontes_recurso';

    protected $fillable = [
        'codigo',
        'descricao',
    ];

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}