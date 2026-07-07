<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NaturezaDespesa extends Model
{
    protected $table = 'natureza_despesas';

    protected $fillable = [
        'codigo',
        'descricao',
    ];

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}