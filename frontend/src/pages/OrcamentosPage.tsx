import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { api } from '../api/client'

type Orcamento = {
  id: number
  ano: number
  status: string
  dotacao_atualizada: string
  valor_empenhado: string
  valor_pago: string
  saldo: string
  percentual_execucao: string
  orgao?: {
    sigla: string
    nome: string
  }
  programa?: {
    nome: string
  }
  acao?: {
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

export function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [meta, setMeta] = useState<PaginatedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrcamentos() {
      try {
        setLoading(true)
        setError('')

        const response = await api.get<PaginatedResponse>('/orcamentos?per_page=10')

        setOrcamentos(response.data.data)
        setMeta(response.data)
      } catch {
        setError('Não foi possível carregar os orçamentos.')
      } finally {
        setLoading(false)
      }
    }

    loadOrcamentos()
  }, [])

  function handleLogout() {
    localStorage.removeItem('@seplag:token')
    localStorage.removeItem('@seplag:user')
    window.location.href = '/'
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Orçamentos</h1>
          <p style={styles.subtitle}>
            Consulta dos registros de execução orçamentária
          </p>
        </div>

        <div style={styles.headerActions}>
          <a style={styles.linkButton} href="/dashboard">
            Dashboard
          </a>

          <button style={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {loading && <p style={styles.message}>Carregando orçamentos...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <section style={styles.card}>
          <div style={styles.tableHeader}>
            <h2 style={styles.cardTitle}>Lista de orçamentos</h2>
            <span style={styles.total}>
              Total: {meta?.total ?? 0} registros
            </span>
          </div>

          <div style={styles.tableWrapper}>
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
                      {orcamento.orgao
                        ? `${orcamento.orgao.sigla}`
                        : 'Informação não disponível'}
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
                      <span style={styles.statusBadge}>
                        {formatStatus(orcamento.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: 'Arial, sans-serif',
    padding: '32px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    color: '#0f172a',
    fontSize: '30px',
    fontWeight: 800,
  },
  subtitle: {
    marginTop: '8px',
    marginBottom: 0,
    color: '#64748b',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  linkButton: {
    textDecoration: 'none',
    borderRadius: '10px',
    background: '#2563eb',
    color: '#ffffff',
    padding: '10px 16px',
    fontWeight: 700,
  },
  logoutButton: {
    border: 0,
    borderRadius: '10px',
    background: '#dc2626',
    color: '#ffffff',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  message: {
    color: '#475569',
  },
  error: {
    color: '#dc2626',
    fontWeight: 700,
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
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
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
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
  statusBadge: {
    display: 'inline-block',
    borderRadius: '999px',
    background: '#e0f2fe',
    color: '#075985',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, CSSProperties>