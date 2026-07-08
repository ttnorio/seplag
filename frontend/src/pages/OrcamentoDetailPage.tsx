import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'

type Contrato = {
  id: number
  numero_contrato: string
  objeto: string
  valor: string
  inicio_vigencia: string
  fim_vigencia: string
  status: string
  fornecedor?: {
    nome: string
    cnpj: string | null
  }
}

type Revisao = {
  id: number
  observacao: string | null
  created_at: string
  user?: {
    name: string
    email: string
  }
}

type OrcamentoDetail = {
  id: number
  ano: number
  status: string
  dotacao_inicial: string | null
  suplementacoes: string | null
  anulacoes: string | null
  dotacao_atualizada: string | null
  valor_empenhado: string | null
  valor_liquidado: string | null
  valor_pago: string | null
  saldo: string | null
  percentual_execucao: string | null
  orgao?: {
    sigla: string
    nome: string
    status: string
  }
  unidade_gestora?: {
    nome: string
  }
  programa?: {
    codigo: string
    nome: string
  }
  acao?: {
    codigo: string
    nome: string
  }
  funcao?: {
    codigo: string
    nome: string
  }
  subfuncao?: {
    codigo: string
    nome: string
  }
  natureza_despesa?: {
    codigo: string
    descricao: string
  }
  fonte_recurso?: {
    codigo: string
    descricao: string
  }
  contratos: Contrato[]
  revisoes: Revisao[]
}

export function OrcamentoDetailPage() {
  const { id } = useParams()
  const [orcamento, setOrcamento] = useState<OrcamentoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [observacao, setObservacao] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')
  

  useEffect(() => {
    async function loadOrcamento() {
      try {
        setLoading(true)
        setError('')

        const response = await api.get<OrcamentoDetail>(`/orcamentos/${id}`)
        setOrcamento(response.data)
      } catch {
        setError('Não foi possível carregar o orçamento.')
      } finally {
        setLoading(false)
      }
    }

    loadOrcamento()
  }, [id])

  async function handleReview() {
    if (!orcamento) {
      return
    }

    try {
      setReviewLoading(true)
      setReviewMessage('')
      setReviewError('')

      const response = await api.patch(`/orcamentos/${orcamento.id}/revisao`, {
        observacao: observacao || null,
      })

      setOrcamento((current) => {
        if (!current) {
          return current
        }

        const revisoesSemDuplicada = current.revisoes.filter(
          (revisao) => revisao.id !== response.data.revisao.id,
        )

        return {
          ...current,
          revisoes: [response.data.revisao, ...revisoesSemDuplicada],
        }
      })

      setObservacao('')
      setReviewMessage('Orçamento marcado como revisado com sucesso.')
    } catch {
      setReviewError('Não foi possível marcar o orçamento como revisado.')
    } finally {
      setReviewLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('@seplag:token')
    localStorage.removeItem('@seplag:user')
    window.location.href = '/'
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Detalhe do orçamento</h1>
          <p className="page-subtitle">
            Consulta completa do registro orçamentário
          </p>
        </div>

        <div className="header-actions">
          <a className="header-button header-button-primary" href="/orcamentos">
            Orçamentos
          </a>

          <button className="header-button header-button-danger" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {loading && <p className="feedback-message">Carregando orçamento...</p>}

      {error && <p className="feedback-error">{error}</p>}

      {orcamento && (
        <div className="content-stack">
          <section className="card-soft">
            <div className="section-header">
              <div>
                <h2 className="section-title">Orçamento #{orcamento.id}</h2>
                <p className="section-subtitle">
                  Ano {orcamento.ano} • {formatStatus(orcamento.status)}
                </p>
              </div>

              <span className="status-badge">{formatStatus(orcamento.status)}</span>
            </div>

            <div className="info-grid">
              <Info
                label="Órgão"
                value={
                  orcamento.orgao
                    ? `${orcamento.orgao.sigla} - ${orcamento.orgao.nome}`
                    : null
                }
              />
              <Info
                label="Unidade gestora"
                value={orcamento.unidade_gestora?.nome}
              />
              <Info
                label="Programa"
                value={
                  orcamento.programa
                    ? `${orcamento.programa.codigo} - ${orcamento.programa.nome}`
                    : null
                }
              />
              <Info
                label="Ação"
                value={
                  orcamento.acao
                    ? `${orcamento.acao.codigo} - ${orcamento.acao.nome}`
                    : null
                }
              />
              <Info
                label="Função"
                value={
                  orcamento.funcao
                    ? `${orcamento.funcao.codigo} - ${orcamento.funcao.nome}`
                    : null
                }
              />
              <Info
                label="Subfunção"
                value={
                  orcamento.subfuncao
                    ? `${orcamento.subfuncao.codigo} - ${orcamento.subfuncao.nome}`
                    : null
                }
              />
              <Info
                label="Natureza da despesa"
                value={
                  orcamento.natureza_despesa
                    ? `${orcamento.natureza_despesa.codigo} - ${orcamento.natureza_despesa.descricao}`
                    : null
                }
              />
              <Info
                label="Fonte de recurso"
                value={
                  orcamento.fonte_recurso
                    ? `${orcamento.fonte_recurso.codigo} - ${orcamento.fonte_recurso.descricao}`
                    : null
                }
              />
            </div>
          </section>

          <section className="card-soft">
            <h2 className="section-title">Valores</h2>

            <div className="values-grid">
              <Info label="Dotação inicial" value={formatCurrency(orcamento.dotacao_inicial)} />
              <Info label="Suplementações" value={formatCurrency(orcamento.suplementacoes)} />
              <Info label="Anulações" value={formatCurrency(orcamento.anulacoes)} />
              <Info label="Dotação atualizada" value={formatCurrency(orcamento.dotacao_atualizada)} />
              <Info label="Empenhado" value={formatCurrency(orcamento.valor_empenhado)} />
              <Info label="Liquidado" value={formatCurrency(orcamento.valor_liquidado)} />
              <Info label="Pago" value={formatCurrency(orcamento.valor_pago)} />
              <Info label="Saldo" value={formatCurrency(orcamento.saldo)} />
              <Info
                label="Percentual de execução"
                value={formatPercent(orcamento.percentual_execucao)}
              />
            </div>
          </section>

          <section className="card-soft">
            <h2 className="section-title">Contratos vinculados</h2>

            {orcamento.contratos.length === 0 ? (
              <p className="empty-text">Informação não disponível.</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table data-table-wide">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fornecedor</th>
                      <th>Objeto</th>
                      <th>Valor</th>
                      <th>Vigência</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orcamento.contratos.map((contrato) => (
                      <tr key={contrato.id}>
                        <td>{contrato.numero_contrato}</td>
                        <td>
                          {contrato.fornecedor?.nome ??
                            'Informação não disponível'}
                        </td>
                        <td>{contrato.objeto}</td>
                        <td>{formatCurrency(contrato.valor)}</td>
                        <td>
                          {formatDate(contrato.inicio_vigencia)} até{' '}
                          {formatDate(contrato.fim_vigencia)}
                        </td>
                        <td>
                          <span className="status-badge">
                            {formatStatus(contrato.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card-soft">
            <div className="section-header">
              <div>
                <h2 className="section-title">Revisões</h2>
                <p className="section-subtitle">
                  Marque este orçamento como revisado pelo analista autenticado.
                </p>
              </div>
            </div>

            <div className="review-form">
              <label className="form-label-custom">
                Observação
                <textarea
                  className="form-textarea-custom"
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  placeholder="Digite uma observação opcional sobre a revisão."
                />
              </label>

              <button
                className="header-button header-button-primary"
                type="button"
                onClick={handleReview}
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Salvando...' : 'Marcar como revisado'}
              </button>

              {reviewMessage && <p className="feedback-success">{reviewMessage}</p>}
              {reviewError && <p className="feedback-error">{reviewError}</p>}
            </div>

            {orcamento.revisoes.length === 0 ? (
              <p className="empty-text">Orçamento ainda não revisado.</p>
            ) : (
              <div className="review-list">
                {orcamento.revisoes.map((revisao) => (
                  <article key={revisao.id} className="review-item">
                    <strong>{revisao.user?.name ?? 'Analista não informado'}</strong>
                    <span>{formatDateTime(revisao.created_at)}</span>
                    <p>{revisao.observacao ?? 'Informação não disponível.'}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <strong className="info-value">
        {value || 'Informação não disponível'}
      </strong>
    </div>
  )
}

function formatCurrency(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 'Informação não disponível'
  }

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return 'Informação não disponível'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue)
}

function formatPercent(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 'Informação não disponível'
  }

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) {
    return 'Informação não disponível'
  }

  return `${numericValue.toFixed(2)}%`
}

function formatStatus(status: string) {
  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
