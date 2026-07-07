<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orcamento extends Model
{
    protected $table = 'orcamentos';
    /**
     * Campos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'ano',

        'orgao_id',
        'unidade_gestora_id',
        'programa_id',
        'acao_id',
        'funcao_id',
        'subfuncao_id',
        'natureza_despesa_id',
        'fonte_recurso_id',

        'dotacao_inicial',
        'suplementacoes',
        'anulacoes',
        'dotacao_atualizada',

        'valor_empenhado',
        'valor_liquidado',
        'valor_pago',

        'saldo',
        'percentual_execucao',

        'status',
    ];

    /**
     * Conversões automáticas de tipos.
     */
    protected function casts(): array
    {
        return [
            'ano' => 'integer',

            'dotacao_inicial' => 'decimal:2',
            'suplementacoes' => 'decimal:2',
            'anulacoes' => 'decimal:2',
            'dotacao_atualizada' => 'decimal:2',

            'valor_empenhado' => 'decimal:2',
            'valor_liquidado' => 'decimal:2',
            'valor_pago' => 'decimal:2',

            'saldo' => 'decimal:2',
            'percentual_execucao' => 'decimal:2',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function orgao(): BelongsTo
    {
        return $this->belongsTo(Orgao::class);
    }

    public function unidadeGestora(): BelongsTo
    {
        return $this->belongsTo(UnidadeGestora::class);
    }

    public function programa(): BelongsTo
    {
        return $this->belongsTo(Programa::class);
    }

    public function acao(): BelongsTo
    {
        return $this->belongsTo(Acao::class);
    }

    public function funcao(): BelongsTo
    {
        return $this->belongsTo(Funcao::class);
    }

    public function subfuncao(): BelongsTo
    {
        return $this->belongsTo(Subfuncao::class);
    }

    public function naturezaDespesa(): BelongsTo
    {
        return $this->belongsTo(NaturezaDespesa::class);
    }

    public function fonteRecurso(): BelongsTo
    {
        return $this->belongsTo(FonteRecurso::class);
    }

    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class);
    }

    public function revisoes(): HasMany
    {
        return $this->hasMany(Revisao::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Query Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeExecutados(Builder $query): Builder
    {
        return $query->where('status', 'executado');
    }

    public function scopeInconsistentes(Builder $query): Builder
    {
        return $query->where('status', 'inconsistente');
    }

    public function scopeDoAno(Builder $query, int $ano): Builder
    {
        return $query->where('ano', $ano);
    }
}