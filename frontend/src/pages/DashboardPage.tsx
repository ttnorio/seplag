import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { api } from '../api/client'

type StoredUser = {
  id: number
  name: string
  email: string
  preferred_username: string
}

type DashboardData = {
  total_orgaos: number
  total_orcamentos: number
  total_contratos: number
  orcamento_total: number
  empenhado: number
  liquidado: number
  pago: number
  saldo: number
  percentual_execucao: number
  total_revisados: number
  total_nao_revisados: number
  orcamentos_por_status: Record<string, number>
  contratos_por_status: Record<string, number>
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userRaw = localStorage.getItem('@seplag:user')
  const user = userRaw ? (JSON.parse(userRaw) as StoredUser) : null

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const response = await api.get<DashboardData>('/dashboard')
        setData(response.data)
      } catch {
        setError('Não foi possível carregar os dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
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
          <h1 style={styles.title}>Dashboard SEPLAG</h1>
          <p style={styles.subtitle}>
            Acompanhamento da execução orçamentária dos órgãos estaduais
          </p>
          <p style={styles.user}>
            Usuário: <strong>{user?.preferred_username ?? 'Não informado'}</strong>
          </p>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </header>

      {loading && <p style={styles.message}>Carregando indicadores...</p>}

      {error && <p style={styles.error}>{error}</p>}

      {data && (
        <>
          <section style={styles.cardsGrid}>
            <MetricCard title="Órgãos" value={data.total_orgaos} />
            <MetricCard title="Orçamentos" value={data.total_orcamentos} />
            <MetricCard title="Contratos" value={data.total_contratos} />
            <MetricCard
              title="Execução"
              value={`${data.percentual_execucao.toFixed(2)}%`}
            />
            <MetricCard
              title="Orçamento Total"
              value={formatCurrency(data.orcamento_total)}
            />
            <MetricCard title="Empenhado" value={formatCurrency(data.empenhado)} />
            <MetricCard title="Liquidado" value={formatCurrency(data.liquidado)} />
            <MetricCard title="Pago" value={formatCurrency(data.pago)} />
            <MetricCard title="Saldo" value={formatCurrency(data.saldo)} />
            <MetricCard title="Revisados" value={data.total_revisados} />
            <MetricCard title="Não revisados" value={data.total_nao_revisados} />
          </section>

          <section style={styles.sectionGrid}>
            <StatusPanel
              title="Orçamentos por status"
              items={data.orcamentos_por_status}
            />

            <StatusPanel
              title="Contratos por status"
              items={data.contratos_por_status}
            />
          </section>
        </>
      )}
    </main>
  )
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <article style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>
      <strong style={styles.cardValue}>{value}</strong>
    </article>
  )
}

function StatusPanel({
  title,
  items,
}: {
  title: string
  items: Record<string, number>
}) {
  return (
    <article style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>

      <div style={styles.statusList}>
        {Object.entries(items).map(([status, total]) => (
          <div key={status} style={styles.statusItem}>
            <span style={styles.statusName}>{formatStatus(status)}</span>
            <strong>{total}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)
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
  user: {
    marginTop: '12px',
    marginBottom: 0,
    color: '#334155',
    fontSize: '14px',
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '14px',
    fontWeight: 700,
  },
  cardValue: {
    display: 'block',
    marginTop: '10px',
    color: '#0f172a',
    fontSize: '24px',
    lineHeight: 1.2,
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    marginTop: '24px',
  },
  panel: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: '16px',
    color: '#0f172a',
    fontSize: '18px',
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '10px',
    color: '#334155',
  },
  statusName: {
    color: '#475569',
  },
} satisfies Record<string, CSSProperties>