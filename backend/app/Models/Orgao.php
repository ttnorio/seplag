<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orgao extends Model
{
    protected $table = 'orgaos';

    protected $fillable = [
        'sigla',
        'nome',
        'status',
    ];

    public function unidadesGestoras(): HasMany
    {
        return $this->hasMany(UnidadeGestora::class);
    }

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}