import type { CSSProperties } from 'react'

type StoredUser = {
  id: number
  name: string
  email: string
  preferred_username: string
}

export function DashboardPage() {
  const userRaw = localStorage.getItem('@seplag:user')
  const user = userRaw ? (JSON.parse(userRaw) as StoredUser) : null

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
            Sistema de Acompanhamento da Execução Orçamentária
          </p>
        </div>

        <button style={styles.button} onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Login realizado com sucesso</h2>
        <p style={styles.text}>
          Usuário autenticado:{' '}
          <strong>{user?.preferred_username ?? 'Não informado'}</strong>
        </p>
      </section>
    </main>
  )
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
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  title: {
    margin: 0,
    color: '#0f172a',
    fontSize: '28px',
  },
  subtitle: {
    marginTop: '8px',
    color: '#64748b',
  },
  button: {
    border: 0,
    borderRadius: '10px',
    background: '#dc2626',
    color: '#ffffff',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
  },
  cardTitle: {
    margin: 0,
    color: '#0f172a',
  },
  text: {
    color: '#475569',
  },
} satisfies Record<string, CSSProperties>