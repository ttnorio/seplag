import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
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
    orcamento?: {
        id: number
        ano: number
        status: string
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
}

type PaginatedResponse = {
    data: Contrato[]
    current_page: number
    last_page: number
    total: number
    per_page: number
}

type Filters = {
    status: string
    fornecedor: string
    orgao_id: string
    per_page: string
}

const initialFilters: Filters = {
    status: '',
    fornecedor: '',
    orgao_id: '',
    per_page: '10',
}

export function ContratosPage() {
    useEffect(() => {
        document.title = 'Contratos - SEPLAG'
    }, [])
    const [contratos, setContratos] = useState<Contrato[]>([])
    const [meta, setMeta] = useState<PaginatedResponse | null>(null)
    const [filters, setFilters] = useState<Filters>(initialFilters)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    async function loadContratos(pageToLoad = page, filtersToUse = filters) {
        try {
            setLoading(true)
            setError('')

            const params = new URLSearchParams()

            params.set('page', String(pageToLoad))
            params.set('per_page', filtersToUse.per_page)

            if (filtersToUse.status) {
                params.set('status', filtersToUse.status)
            }

            if (filtersToUse.fornecedor) {
                params.set('fornecedor', filtersToUse.fornecedor)
            }

            if (filtersToUse.orgao_id) {
                params.set('orgao_id', filtersToUse.orgao_id)
            }

            const response = await api.get<PaginatedResponse>(
                `/contratos?${params.toString()}`,
            )

            setContratos(response.data.data)
            setMeta(response.data)
            setPage(response.data.current_page)
        } catch {
            setError('Não foi possível carregar os contratos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadContratos(1, filters)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setPage(1)
        loadContratos(1, filters)
    }

    function handleClearFilters() {
        setFilters(initialFilters)
        setPage(1)
        loadContratos(1, initialFilters)
    }

    function handlePreviousPage() {
        if (!meta || meta.current_page <= 1) {
            return
        }

        loadContratos(meta.current_page - 1, filters)
    }

    function handleNextPage() {
        if (!meta || meta.current_page >= meta.last_page) {
            return
        }

        loadContratos(meta.current_page + 1, filters)
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
                    <h1 className="page-title">Contratos</h1>
                    <p className="page-subtitle">
                        Consulta dos contratos vinculados aos registros orçamentários
                    </p>
                </div>

                <div className="header-actions">
                    <a className="header-button header-button-primary" href="/dashboard">
                        Dashboard
                    </a>

                    <a className="header-button header-button-primary" href="/orcamentos">
                        Orçamentos
                    </a>

                    <button className="header-button header-button-danger" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </header>

            <section className="card-soft" style={{ marginBottom: 20 }}>
                <form onSubmit={handleSubmit} className="filters-form">
                    <label className="form-label-custom">
                        Status
                        <select
                            className="form-input-custom"
                            value={filters.status}
                            onChange={(event) =>
                                setFilters((current) => ({
                                    ...current,
                                    status: event.target.value,
                                }))
                            }
                        >
                            <option value="">Todos</option>
                            <option value="vigente">Vigente</option>
                            <option value="encerrado">Encerrado</option>
                            <option value="suspenso">Suspenso</option>
                            <option value="vencido">Vencido</option>
                        </select>
                    </label>

                    <label className="form-label-custom">
                        Fornecedor
                        <input
                            className="form-input-custom"
                            value={filters.fornecedor}
                            onChange={(event) =>
                                setFilters((current) => ({
                                    ...current,
                                    fornecedor: event.target.value,
                                }))
                            }
                            placeholder="Nome ou CNPJ"
                        />
                    </label>

                    <label className="form-label-custom">
                        ID do órgão
                        <input
                            className="form-input-custom"
                            type="number"
                            min="1"
                            value={filters.orgao_id}
                            onChange={(event) =>
                                setFilters((current) => ({
                                    ...current,
                                    orgao_id: event.target.value,
                                }))
                            }
                            placeholder="Ex.: 1"
                        />
                    </label>

                    <label className="form-label-custom">
                        Por página
                        <select
                            className="form-input-custom"
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

                    <div className="filter-actions">
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

            {loading && <p className="feedback-message">Carregando contratos...</p>}

            {error && <p className="feedback-error">{error}</p>}

            {!loading && !error && (
                <section className="card-soft">
                    <div className="table-header">
                        <h2 className="section-title">Lista de contratos</h2>
                        <span className="table-total">Total: {meta?.total ?? 0} registros</span>
                    </div>

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
                                    <th>Órgão</th>
                                    <th>Orçamento</th>
                                </tr>
                            </thead>

                            <tbody>
                                {contratos.map((contrato) => (
                                    <tr key={contrato.id}>
                                        <td>{contrato.numero_contrato}</td>
                                        <td>
                                            <strong>{contrato.fornecedor?.nome ?? 'Não informado'}</strong>
                                            <br />
                                            <span>{contrato.fornecedor?.cnpj ?? 'CNPJ não informado'}</span>
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
                                        <td>
                                            {contrato.orcamento?.orgao?.sigla ??
                                                'Informação não disponível'}
                                        </td>
                                        <td>
                                            {contrato.orcamento?.id ? (
                                                <a
                                                    className="header-button header-button-secondary"
                                                    href={`/orcamentos/${contrato.orcamento.id}`}
                                                >
                                                    Ver orçamento
                                                </a>
                                            ) : (
                                                'Informação não disponível'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-actions">
                        <button
                            className="header-button header-button-secondary"
                            onClick={handlePreviousPage}
                            disabled={!meta || meta.current_page <= 1}
                        >
                            Anterior
                        </button>

                        <span className="pagination-text">
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

function formatStatus(status: string) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}