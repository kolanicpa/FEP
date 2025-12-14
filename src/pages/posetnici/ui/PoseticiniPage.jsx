import { useState, useEffect } from 'react'
import { Card } from '@/shared/ui/Card'
import { Button, Input, Label } from '@/shared/ui/shadcn'
import { ticketService } from '@/shared/api/ticketService'
import { Trash2 } from 'lucide-react'

const PoseticiniPage = () => {
  const [performances, setPerformances] = useState([])
  const [selectedPerformanceId, setSelectedPerformanceId] = useState('')
  const [attendeeEmail, setAttendeeEmail] = useState('')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Fetch performances on mount
  useEffect(() => {
    fetchPerformances()
  }, [])

  // Fetch tickets when performance selected
  useEffect(() => {
    if (selectedPerformanceId) {
      fetchTicketsForPerformance(selectedPerformanceId)
    } else {
      setTickets([])
    }
  }, [selectedPerformanceId])

  const fetchPerformances = async () => {
    try {
      const data = await ticketService.getPerformances()
      setPerformances(data.performances)
    } catch (err) {
      setError('Failed to load performances')
    }
  }

  const fetchTicketsForPerformance = async (performanceId) => {
    try {
      const data = await ticketService.getTicketsForPerformance(performanceId)
      setTickets(data.tickets)
    } catch (err) {
      console.error('Failed to load tickets:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      await ticketService.createTicket({
        performanceId: parseInt(selectedPerformanceId),
        email: attendeeEmail
      })

      setSuccessMessage(`Ulaznica uspešno poslata na ${attendeeEmail}`)
      setAttendeeEmail('')

      fetchTicketsForPerformance(selectedPerformanceId)
      fetchPerformances() // Refresh to update available tickets
    } catch (err) {
      setError(err.message || 'Greška prilikom kreiranja ulaznice')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovu ulaznicu?')) {
      return
    }

    try {
      await ticketService.deleteTicket(ticketId)
      setSuccessMessage('Ulaznica uspešno obrisana')

      // Refresh data
      fetchTicketsForPerformance(selectedPerformanceId)
      fetchPerformances() // Refresh to update available tickets
    } catch (err) {
      setError(err.message || 'Greška prilikom brisanja ulaznice')
    }
  }

  const selectedPerformance = performances.find(
    (p) => p.id === parseInt(selectedPerformanceId),
  )

  return (
    <main className="layout narrow">
      <div className="auth-header">
        <p className="pill">
          Administracija <strong>Posetnici</strong>
        </p>
        <h1>Upravljanje poseticima</h1>
        <p className="muted">Dodajte posetioce za predstave i šaljite ulaznice putem email-a.</p>
      </div>

      <Card>
        <div className="table-toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Dodaj posetilaca</h2>
            <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
              Izaberite predstavu i unesite email adresu za slanje ulaznice.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-grid">
            <div className="field">
              <Label htmlFor="performance">Predstava</Label>
              <select
                id="performance"
                className="sh-input"
                value={selectedPerformanceId}
                onChange={(e) => setSelectedPerformanceId(e.target.value)}
                required
              >
                <option value="">Izaberite predstavu...</option>
                {performances
                  .filter((p) => p.status === 'Aktivna' && p.available_tickets > 0)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.start_date} ({p.available_tickets} dostupnih)
                    </option>
                  ))}
              </select>
            </div>

            <div className="field">
              <Label htmlFor="email">Email posetilaca</Label>
              <Input
                id="email"
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                placeholder="posetilac@example.com"
                required
                disabled={!selectedPerformanceId}
              />
            </div>
          </div>

          {selectedPerformance && (
            <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 14 }}>
              <strong>{selectedPerformance.name}</strong> · {selectedPerformance.start_date} u{' '}
              {selectedPerformance.satnica} · {selectedPerformance.available_tickets}/
              {selectedPerformance.total_tickets} dostupno
            </div>
          )}

          {error && (
            <p className="auth-error" style={{ marginTop: 10 }}>
              {error}
            </p>
          )}

          {successMessage && (
            <p style={{ color: '#22c55e', fontWeight: 600, marginTop: 10 }}>{successMessage}</p>
          )}

          <div className="form-actions" style={{ marginTop: 16 }}>
            <Button type="submit" disabled={loading || !selectedPerformanceId}>
              {loading ? 'Slanje...' : 'Pošalji ulaznica'}
            </Button>
          </div>
        </form>

        {selectedPerformanceId && tickets.length > 0 && (
          <>
            <div className="table-toolbar" style={{ marginTop: 30 }}>
              <div>
                <h3 style={{ margin: 0 }}>Posetnici za {selectedPerformance?.name}</h3>
                <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                  Ukupno {tickets.length} {tickets.length === 1 ? 'posetilac' : tickets.length < 5 ? 'posetilaca' : 'posetilaca'}
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email posetilaca</th>
                    <th>ID ulaznice</th>
                    <th>Status</th>
                    <th>Datum kreiranja</th>
                    <th>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td style={{ color: '#94a3b8', fontSize: 14 }}>{index + 1}</td>
                      <td><strong>{ticket.attendee_email}</strong></td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>
                        {ticket.id.substring(0, 8)}...
                      </td>
                      <td>
                        <span
                          className={`status-badge ${ticket.status === 'valid' ? 'ok' : 'warn'}`}
                        >
                          {ticket.status === 'valid'
                            ? 'Važeća'
                            : ticket.status === 'used'
                              ? 'Iskorišćena'
                              : 'Otkazana'}
                        </span>
                      </td>
                      <td>{new Date(ticket.created_at).toLocaleDateString('sr-RS')}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="icon-button danger"
                          title="Obriši ulaznicu"
                          style={{
                            padding: '6px',
                            color: '#ef4444',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedPerformanceId && tickets.length === 0 && (
          <div style={{ marginTop: 30, textAlign: 'center', padding: '40px 20px' }}>
            <p className="muted">Nema posetilaca za ovu predstavu.</p>
            <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>
              Dodajte prvog posetilaca koristeći formu iznad.
            </p>
          </div>
        )}
      </Card>
    </main>
  )
}

export { PoseticiniPage }
