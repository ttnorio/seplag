import { useEffect, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { api } from '../api/client'
import type { LoginResponse } from '../types/auth'

export function LoginPage() {
  useEffect(() => {
    document.title = 'Login - SEPLAG'
  }, [])

    const [email, setEmail] = useState('analista@seplag.rj.gov.br')
    const [password, setPassword] = useState('orcamento@2026')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent) {
      event.preventDefault()

      try {
        setLoading(true)
        setError('')

        const response = await api.post<LoginResponse>('/auth/login', {
          email,
          password,
        })

        localStorage.setItem('@seplag:token', response.data.access_token)
        localStorage.setItem('@seplag:user', JSON.stringify(response.data.user))

        window.location.href = '/dashboard'
      } catch {
        setError('Não foi possível realizar o login. Verifique as credenciais.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <div>
            <h1 style={styles.title}>SEPLAG</h1>
            <p style={styles.subtitle}>
              Sistema de Acompanhamento da Execução Orçamentária
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              E-mail
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label style={styles.label}>
              Senha
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      fontFamily: 'Arial, sans-serif',
      padding: '24px',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
    },
    title: {
      margin: 0,
      color: '#0f172a',
      fontSize: '32px',
      fontWeight: 800,
    },
    subtitle: {
      marginTop: '8px',
      color: '#64748b',
      lineHeight: 1.5,
    },
    form: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    label: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      color: '#334155',
      fontWeight: 600,
      fontSize: '14px',
    },
    input: {
      height: '44px',
      borderRadius: '10px',
      border: '1px solid #cbd5e1',
      padding: '0 12px',
      fontSize: '15px',
    },
    button: {
      height: '46px',
      border: 0,
      borderRadius: '10px',
      background: '#2563eb',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
    },
    error: {
      margin: 0,
      color: '#dc2626',
      fontSize: '14px',
    },
  } satisfies Record<string, CSSProperties>