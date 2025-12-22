import { useState, useEffect } from 'react'
import { Card } from '@/shared/ui/Card'
import { Button, Input, Label } from '@/shared/ui/shadcn'
import { performanceService } from '@/shared/api/performanceService'

const emptyForm = {
  title: '',
  artist: '',
  description: '',
  genre: '',
  startTime: '',
  endTime: '',
  locationId: '',
  duration: '60',
  isHeadliner: false,
  qrCode: '',
}

const PredstavePage = () => {
  const [performances, setPerformances] = useState([])
  const [formValues, setFormValues] = useState(emptyForm)
  const [modalState, setModalState] = useState({ open: false, mode: 'add', editingId: null })
  const [filterYear, setFilterYear] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPerformances()
  }, [])

  const loadPerformances = async () => {
    try {
      setLoading(true)
      const data = await performanceService.getAll()

      console.log('Raw data from API:', data)

      // Transform Firebase timestamp to readable format
      const transformedData = data.map(perf => ({
        id: perf.id,
        title: perf.title,
        artist: perf.artist,
        description: perf.description,
        genre: perf.genre,
        startTime: perf.startTime,
        endTime: perf.endTime,
        locationId: perf.locationId,
        duration: perf.duration,
        isHeadliner: perf.isHeadliner,
        isActive: perf.isActive,
        qrCode: perf.qr_code || ''
      }))

      console.log('Transformed data:', transformedData)
      setPerformances(transformedData)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to load performances:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setFormValues(emptyForm)
    setModalState({ open: true, mode: 'add', editingId: null })
  }

  const openEditModal = (row) => {
    setFormValues({
      title: row.title,
      artist: row.artist,
      description: row.description,
      genre: row.genre,
      startTime: row.startTime,
      endTime: row.endTime,
      locationId: row.locationId,
      duration: row.duration,
      isHeadliner: row.isHeadliner,
      qrCode: row.qrCode,
    })
    setModalState({ open: true, mode: 'edit', editingId: row.id })
  }

  const closeModal = () => {
    setModalState({ open: false, mode: 'add', editingId: null })
  }

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const buildQrCode = (payload) => {
    const content = JSON.stringify(payload)
    const encoded = encodeURIComponent(content)
    return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encoded}`
  }

  const handleGenerateQr = () => {
    const qrPayload = {
      title: formValues.title,
      artist: formValues.artist,
      genre: formValues.genre,
      startTime: formValues.startTime,
      duration: formValues.duration,
    }
    setFormValues((prev) => ({ ...prev, qrCode: buildQrCode(qrPayload) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      if (modalState.mode === 'edit' && modalState.editingId) {
        // TODO: Implement update API endpoint
        setPerformances((prev) =>
          prev.map((row) =>
            row.id === modalState.editingId
              ? {
                  ...row,
                  ...formValues,
                  duration: Number(formValues.duration) || 60,
                  qrCode: formValues.qrCode || buildQrCode(formValues),
                  id: row.id,
                }
              : row,
          ),
        )
      } else {
        const newPerformance = await performanceService.create(formValues)

        // Transform Firebase data to match UI format
        const uiPerformance = {
          id: newPerformance.id,
          title: newPerformance.title,
          artist: newPerformance.artist,
          description: newPerformance.description,
          genre: newPerformance.genre,
          startTime: newPerformance.startTime,
          endTime: newPerformance.endTime,
          locationId: newPerformance.locationId,
          duration: newPerformance.duration,
          isHeadliner: newPerformance.isHeadliner,
          isActive: newPerformance.isActive,
          qrCode: formValues.qrCode || buildQrCode(formValues)
        }

        setPerformances((prev) => [...prev, uiPerformance])
      }

      closeModal()
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Failed to save performance:', err)
      alert('Failed to save: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    setPerformances((prev) => prev.filter((row) => row.id !== id))

    if (modalState.editingId === id) {
      closeModal()
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '—'
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp)
    return date.toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const yearOptions = Array.from(
    new Set(performances.map((row) => {
      if (!row.startTime) return null
      const date = row.startTime._seconds ? new Date(row.startTime._seconds * 1000) : new Date(row.startTime)
      return date.getFullYear().toString()
    }).filter(Boolean)),
  ).sort()

  const filteredPerformances =
    filterYear === 'all'
      ? performances
      : performances.filter((row) => {
          if (!row.startTime) return false
          const date = row.startTime._seconds ? new Date(row.startTime._seconds * 1000) : new Date(row.startTime)
          return date.getFullYear().toString() === filterYear
        })

  return (
    <main className="layout narrow">
      <div className="auth-header">
        <p className="pill">
          Repertoar <strong>Predstave</strong>
        </p>
        <h1>Predstave</h1>
        <p className="muted">Pregled predstava sa osnovnim statusom, datumom i satnicom.</p>
      </div>

      <Card>
        {error && (
          <div style={{ padding: '16px', background: '#fee', color: '#c00', marginBottom: '16px', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}
        {loading && <div style={{ padding: '16px', textAlign: 'center' }}>Loading...</div>}
        <div className="table-toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Raspored predstava</h2>
            <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
              Dodajte, uredite ili uklonite predstave iz repertoara. ({performances.length} performances loaded)
            </p>
          </div>
          <div className="toolbar-actions">
            <div className="field compact">
              <Label htmlFor="filterYear">Godina</Label>
              <select
                id="filterYear"
                className="sh-input"
                value={filterYear}
                onChange={(event) => setFilterYear(event.target.value)}
              >
                <option value="all">Sve godine</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={openAddModal}>+ Dodaj predstavu</Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="sh-table">
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Izvođač</th>
                <th>Žanr</th>
                <th>Početak</th>
                <th>Trajanje</th>
                <th>Headliner</th>
                <th>Status</th>
                <th>QR kod</th>
                <th>Uredi</th>
                <th>Obriši</th>
              </tr>
            </thead>
            <tbody>
              {filteredPerformances.map((row) => (
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>{row.artist}</td>
                  <td>{row.genre || '—'}</td>
                  <td>{formatDateTime(row.startTime)}</td>
                  <td>{row.duration ? `${row.duration} min` : '—'}</td>
                  <td>
                    {row.isHeadliner ? (
                      <span className="status-badge ok">Da</span>
                    ) : (
                      <span className="status-badge">Ne</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${row.isActive ? 'ok' : 'warn'}`}>
                      {row.isActive ? 'Aktivna' : 'Neaktivna'}
                    </span>
                  </td>
                  <td>
                    {row.qrCode ? (
                      <img className="qr-thumb" src={row.qrCode} alt={`QR ${row.title}`} />
                    ) : (
                      <Button variant="ghost" onClick={() => openEditModal(row)}>
                        Kreiraj QR
                      </Button>
                    )}
                  </td>
                  <td>
                    <Button variant="outline" onClick={() => openEditModal(row)}>
                      Uredi
                    </Button>
                  </td>
                  <td>
                    <Button variant="ghost" onClick={() => handleDelete(row.id)}>
                      Obriši
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalState.open ? (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-window">
              <div className="edit-form__head">
                <div>
                  <h3 style={{ margin: 0 }}>
                    {modalState.mode === 'edit' ? 'Uredi predstavu' : 'Dodaj novu predstavu'}
                  </h3>
                  <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                    Popunite detalje pa sačuvajte izmene.
                  </p>
                </div>
                <span className="pill subtle">
                  {modalState.mode === 'edit'
                    ? `ID: ${modalState.editingId}`
                    : 'Nova predstava'}
                </span>
              </div>

              <form className="edit-form" onSubmit={handleSubmit}>
                <div className="edit-grid">
                  <div className="field">
                    <Label htmlFor="title">Naziv</Label>
                    <Input
                      id="title"
                      value={formValues.title}
                      onChange={(event) => handleInputChange('title', event.target.value)}
                      placeholder="Naziv performansa"
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="artist">Izvođač</Label>
                    <Input
                      id="artist"
                      value={formValues.artist}
                      onChange={(event) => handleInputChange('artist', event.target.value)}
                      placeholder="Ime izvođača ili benda"
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="genre">Žanr</Label>
                    <Input
                      id="genre"
                      value={formValues.genre}
                      onChange={(event) => handleInputChange('genre', event.target.value)}
                      placeholder="Rock, Jazz, Electronic..."
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="description">Opis</Label>
                    <Input
                      id="description"
                      value={formValues.description}
                      onChange={(event) => handleInputChange('description', event.target.value)}
                      placeholder="Kratak opis performansa"
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="startTime">Početak</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formValues.startTime}
                      onChange={(event) => handleInputChange('startTime', event.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="endTime">Kraj</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formValues.endTime}
                      onChange={(event) => handleInputChange('endTime', event.target.value)}
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="duration">Trajanje (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={formValues.duration}
                      onChange={(event) => handleInputChange('duration', event.target.value)}
                      placeholder="60"
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="locationId">Lokacija ID</Label>
                    <Input
                      id="locationId"
                      value={formValues.locationId}
                      onChange={(event) => handleInputChange('locationId', event.target.value)}
                      placeholder="ID lokacije"
                    />
                  </div>

                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="isHeadliner" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        id="isHeadliner"
                        checked={formValues.isHeadliner}
                        onChange={(event) => handleInputChange('isHeadliner', event.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      Headliner nastup
                    </Label>
                  </div>
                </div>

                <div className="form-actions modal-actions">
                  <Button variant="outline" type="button" onClick={handleGenerateQr} disabled={loading}>
                    Generiši QR
                  </Button>
                  <Button variant="ghost" type="button" onClick={closeModal} disabled={loading}>
                    Otkaži
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Čuvanje...' : modalState.mode === 'edit' ? 'Sačuvaj izmene' : 'Dodaj predstavu'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Card>
    </main>
  )
}

export { PredstavePage }
