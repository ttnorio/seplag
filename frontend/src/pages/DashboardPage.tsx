import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

type GraficoData = {
  execucao_por_orgao: {
    id: number
    sigla: string
    nome: string
    dotacao_atualizada: number
    valor_empenhado: number
    valor_pago: number
    percentual_execucao: number
  }[]

  execucao_por_programa: {
    id: number
    codigo: string
    nome: string
    dotacao_atualizada: number
    valor_empenhado: number
    valor_pago: number
    percentual_execucao: number
  }[]

  empenhado_x_pago: {
    empenhado: number
    liquidado: number
    pago: number
  }

  top_10_contratos: {
    id: number
    numero_contrato: string
    objeto: string
    valor: string
    status: string
    fornecedor?: {
      nome: string
      cnpj: string | null
    }
    orcamento?: {
      orgao?: {
        sigla: string
        nome: string
      }
    }
  }[]

  evolucao_anual: {
    ano: number
    dotacao_atualizada: number
    valor_empenhado: number
    valor_liquidado: number
    valor_pago: number
  }[]

  orcamentos_por_status: {
    status: string
    total: number
  }[]

  contratos_por_status: {
    status: string
    total: number
  }[]
}

const chartColors = ['#2563eb', '#16a34a', '#f97316', '#dc2626', '#7c3aed']

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [graficos, setGraficos] = useState<GraficoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userRaw = localStorage.getItem('@seplag:user')
  const user = userRaw ? (JSON.parse(userRaw) as StoredUser) : null

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const [dashboardResponse, graficosResponse] = await Promise.all([
          api.get<DashboardData>('/dashboard'),
          api.get<GraficoData>('/graficos'),
        ])

        setData(dashboardResponse.data)
        setGraficos(graficosResponse.data)
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
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard SEPLAG</h1>
          <p className="page-subtitle">
            Acompanhamento da execução orçamentária dos órgãos estaduais
          </p>
          <p style={styles.user}>
            Usuário: <strong>{user?.preferred_username ?? 'Não informado'}</strong>
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

          {graficos && (
            <section className="dashboard-charts">
              <article className="card-soft chart-card">
                <h2 className="section-title">Execução por órgão</h2>
                <p className="section-subtitle">
                  Percentual de execução dos órgãos com maior dotação.
                </p>

                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={graficos.execucao_por_orgao.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sigla" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="percentual_execucao"
                        name="% execução"
                        fill="#2563eb"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="card-soft chart-card">
                <h2 className="section-title">Evolução anual</h2>
                <p className="section-subtitle">
                  Comparativo entre dotação, empenhado e pago por ano.
                </p>

                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={graficos.evolucao_anual}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ano" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar
                        dataKey="dotacao_atualizada"
                        name="Dotação"
                        fill="#2563eb"
                      />
                      <Bar
                        dataKey="valor_empenhado"
                        name="Empenhado"
                        fill="#f97316"
                      />
                      <Bar dataKey="valor_pago" name="Pago" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="card-soft chart-card">
                <h2 className="section-title">Orçamentos por status</h2>
                <p className="section-subtitle">
                  Distribuição dos registros orçamentários por situação.
                </p>

                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={graficos.orcamentos_por_status}
                        dataKey="total"
                        nameKey="status"
                        outerRadius={110}
                      >
                        {graficos.orcamentos_por_status.map((entry, index) => (
                          <Cell
                            key={entry.status}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend formatter={(value) => formatStatus(String(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="card-soft chart-card">
                <h2 className="section-title">Top 10 contratos</h2>
                <p className="section-subtitle">Maiores contratos por valor.</p>

                <div className="top-contracts-list">
                  {graficos.top_10_contratos.map((contrato) => (
                    <div key={contrato.id} className="top-contract-item">
                      <div>
                        <strong>{contrato.numero_contrato}</strong>
                        <p>
                          {contrato.fornecedor?.nome ??
                            'Fornecedor não informado'}
                        </p>
                        <span>
                          {contrato.orcamento?.orgao?.sigla ??
                            'Órgão não informado'}
                        </span>
                      </div>

                      <strong>{formatCurrency(Number(contrato.valor))}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}
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
  user: {
    marginTop: '12px',
    marginBottom: 0,
    color: '#334155',
    fontSize: '14px',
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