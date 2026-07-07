import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { api } from '../api/client'

type Orcamento = {
  id: number
  ano: number
  status: string
  dotacao_atualizada: string | null
  valor_empenhado: string | null
  valor_pago: string | null
  saldo: string | null
  percentual_execucao: string | null
  orgao?: {
    id: number
    sigla: string
    nome: string
  }
  programa?: {
    id: number
    nome: string
  }
  acao?: {
    id: number
    nome: string
  }
}

type PaginatedResponse = {
  data: Orcamento[]
  current_page: number
  last_page: number
  total: number
  per_page: number
}

type Filters = {
  ano: string
  status: string
  percentual_min: string
  percentual_max: string
  per_page: string
}

const initialFilters: Filters = {
  ano: '',
  status: '',
  percentual_min: '',
  percentual_max: '',
  per_page: '10',
}

export function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [meta, setMeta] = useState<PaginatedResponse | null>(null)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadOrcamentos(pageToLoad = page, filtersToUse = filters) {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      params.set('page', String(pageToLoad))
      params.set('per_page', filtersToUse.per_page)

      if (filtersToUse.ano) {
        params.set('ano', filtersToUse.ano)
      }

      if (filtersToUse.status) {
        params.set('status', filtersToUse.status)
      }

      if (filtersToUse.percentual_min) {
        params.set('percentual_min', filtersToUse.percentual_min)
      }

      if (filtersToUse.percentual_max) {
        params.set('percentual_max', filtersToUse.percentual_max)
      }

      const response = await api.get<PaginatedResponse>(
        `/orcamentos?${params.toString()}`,
      )

      setOrcamentos(response.data.data)
      setMeta(response.data)
      setPage(response.data.current_page)
    } catch {
      setError('Não foi possível carregar os orçamentos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrcamentos(1, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setPage(1)
    loadOrcamentos(1, filters)
  }

  function handleClearFilters() {
    setFilters(initialFilters)
    setPage(1)
    loadOrcamentos(1, initialFilters)
  }

  function handlePreviousPage() {
    if (!meta || meta.current_page <= 1) {
      return
    }

    loadOrcamentos(meta.current_page - 1, filters)
  }

  function handleNextPage() {
    if (!meta || meta.current_page >= meta.last_page) {
      return
    }

    loadOrcamentos(meta.current_page + 1, filters)
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
          <h1 className="page-title">Orçamentos</h1>
          <p className="page-subtitle">
            Consulta dos registros de execução orçamentária
          </p>
        </div>

        <div className="header-actions">
          <a className="header-button header-button-primary" href="/dashboard">
            Dashboard
          </a>

          <button className="header-button header-button-danger" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <section className="card-soft" style={styles.filtersCard}>
        <form onSubmit={handleSubmit} style={styles.filtersForm}>
          <label style={styles.field}>
            Ano
            <select
              style={styles.input}
              value={filters.ano}
              onChange={(event) =>
                setFilters((current) => ({ ...current, ano: event.target.value }))
              }
            >
              <option value="">Todos</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </label>

          <label style={styles.field}>
            Status
            <select
              style={styles.input}
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
            >
              <option value="">Todos</option>
              <option value="sem_execucao">Sem execução</option>
              <option value="em_execucao">Em execução</option>
              <option value="executado">Executado</option>
              <option value="saldo_negativo">Saldo negativo</option>
              <option value="inconsistente">Inconsistente</option>
            </select>
          </label>

          <label style={styles.field}>
            Execução mínima (%)
            <input
              style={styles.input}
              type="number"
              min="0"
              max="100"
              value={filters.percentual_min}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  percentual_min: event.target.value,
                }))
              }
            />
          </label>

          <label style={styles.field}>
            Execução máxima (%)
            <input
              style={styles.input}
              type="number"
              min="0"
              max="150"
              value={filters.percentual_max}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  percentual_max: event.target.value,
                }))
              }
            />
          </label>

          <label style={styles.field}>
            Por página
            <select
              style={styles.input}
              value={filters.per_page}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  per_page: event.target.value,
                }))
              }
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </label>

          <div style={styles.filterActions}>
            <button className="header-button header-button-primary" type="submit">
              Filtrar
            </button>

            <button
              className="header-button header-button-secondary"
              type="button"
              onClick={handleClearFilters}
            >
              Limpar
            </button>
          </div>
        </form>
      </section>

      {loading && <p style={styles.message}>Carregando orçamentos...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <section className="card-soft">
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Lista de orçamentos</h2>
            <span style={styles.total}>Total: {meta?.total ?? 0} registros</span>
          </div>

          <div className="table-wrapper">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Ano</th>
                  <th style={styles.th}>Órgão</th>
                  <th style={styles.th}>Programa</th>
                  <th style={styles.th}>Ação</th>
                  <th style={styles.th}>Dotação</th>
                  <th style={styles.th}>Empenhado</th>
                  <th style={styles.th}>Pago</th>
                  <th style={styles.th}>Saldo</th>
                  <th style={styles.th}>Execução</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {orcamentos.map((orcamento) => (
                  <tr key={orcamento.id}>
                    <td style={styles.td}>{orcamento.id}</td>
                    <td style={styles.td}>{orcamento.ano}</td>
                    <td style={styles.td}>
                      {orcamento.orgao?.sigla ?? 'Informação não disponível'}
                    </td>
                    <td style={styles.td}>
                      {orcamento.programa?.nome ?? 'Informação não disponível'}
                    </td>
                    <td style={styles.td}>
                      {orcamento.acao?.nome ?? 'Informação não disponível'}
                    </td>
                    <td style={styles.td}>
                      {formatCurrency(orcamento.dotacao_atualizada)}
                    </td>
                    <td style={styles.td}>
                      {formatCurrency(orcamento.valor_empenhado)}
                    </td>
                    <td style={styles.td}>
                      {formatCurrency(orcamento.valor_pago)}
                    </td>
                    <td style={styles.td}>{formatCurrency(orcamento.saldo)}</td>
                    <td style={styles.td}>
                      {formatPercent(orcamento.percentual_execucao)}
                    </td>
                    <td style={styles.td}>
                      <span className="status-badge">
                        {formatStatus(orcamento.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              className="header-button header-button-secondary"
              onClick={handlePreviousPage}
              disabled={!meta || meta.current_page <= 1}
            >
              Anterior
            </button>

            <span style={styles.paginationText}>
              Página {meta?.current_page ?? 1} de {meta?.last_page ?? 1}
            </span>

            <button
              className="header-button header-button-secondary"
              onClick={handleNextPage}
              disabled={!meta || meta.current_page >= meta.last_page}
            >
              Próxima
            </button>
          </div>
        </section>
      )}
    </main>
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

const styles = {
  filtersCard: {
    marginBottom: '20px',
  },
  filtersForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    alignItems: 'end',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    color: '#334155',
    fontSize: '14px',
    fontWeight: 700,
  },
  input: {
    height: '42px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    padding: '0 10px',
    fontSize: '14px',
  },
  filterActions: {
    display: 'flex',
    gap: '10px',
  },
  message: {
    color: '#475569',
  },
  error: {
    color: '#dc2626',
    fontWeight: 700,
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  cardTitle: {
    margin: 0,
    color: '#0f172a',
    fontSize: '18px',
  },
  total: {
    color: '#64748b',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1200px',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#0f172a',
    fontSize: '14px',
    verticalAlign: 'top',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginTop: '18px',
  },
  paginationText: {
    color: '#475569',
    fontSize: '14px',
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>