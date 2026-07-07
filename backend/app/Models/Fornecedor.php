<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fornecedor extends Model
{
    protected $table = 'fornecedores';
    protected $fillable = [
        'nome',
        'cnpj',
    ];

    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class);
    }
}