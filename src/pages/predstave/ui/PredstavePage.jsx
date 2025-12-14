import { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Button, Input, Label } from '@/shared/ui/shadcn'

const initialPerformances = [
  {
    id: 1,
    name: 'Hamlet',
    status: 'Aktivna',
    startDate: '2024-03-12',
    satnica: '19:30',
    category: 'Tragedija',
    tickets: 320,
    qrCode: '',
  },
  {
    id: 2,
    name: 'The Cherry Orchard',
    status: 'Pauzirana',
    startDate: '2024-05-08',
    satnica: '20:00',
    category: 'Drama',
    tickets: 280,
    qrCode: '',
  },
  {
    id: 3,
    name: 'Waiting for Godot',
    status: 'Aktivna',
    startDate: '2024-06-20',
    satnica: '18:30',
    category: 'Drama',
    tickets: 140,
    qrCode: '',
  },
  {
    id: 4,
    name: 'A Streetcar Named Desire',
    status: 'Pauzirana',
    startDate: '2024-07-02',
    satnica: '21:00',
    category: 'Klasik',
    tickets: 200,
    qrCode: '',
  },
]

const emptyForm = {
  name: '',
  status: 'Aktivna',
  startDate: '',
  satnica: '',
  category: '',
  tickets: '',
  qrCode: '',
}

const PredstavePage = () => {
  const [performances, setPerformances] = useState(initialPerformances)
  const [formValues, setFormValues] = useState(emptyForm)
  const [modalState, setModalState] = useState({ open: false, mode: 'add', editingId: null })
  const [filterYear, setFilterYear] = useState('all')

  const openAddModal = () => {
    setFormValues(emptyForm)
    setModalState({ open: true, mode: 'add', editingId: null })
  }

  const openEditModal = (row) => {
    setFormValues({
      name: row.name,
      status: row.status,
      startDate: row.startDate,
      satnica: row.satnica,
      category: row.category,
      tickets: row.tickets,
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
      name: formValues.name,
      status: formValues.status,
      startDate: formValues.startDate,
      satnica: formValues.satnica,
      category: formValues.category,
      tickets: formValues.tickets,
    }
    setFormValues((prev) => ({ ...prev, qrCode: buildQrCode(qrPayload) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (modalState.mode === 'edit' && modalState.editingId) {
      setPerformances((prev) =>
        prev.map((row) =>
          row.id === modalState.editingId
            ? {
                ...row,
                ...formValues,
                tickets: Number(formValues.tickets) || 0,
                qrCode:
                  formValues.qrCode ||
                  buildQrCode({ ...formValues, tickets: Number(formValues.tickets) || 0 }),
                id: row.id,
              }
            : row,
        ),
      )
    } else {
      const nextId = performances.length ? Math.max(...performances.map((row) => row.id)) + 1 : 1
      setPerformances((prev) => [
        ...prev,
        {
          ...formValues,
          id: nextId,
          tickets: Number(formValues.tickets) || 0,
          qrCode:
            formValues.qrCode ||
            buildQrCode({ ...formValues, tickets: Number(formValues.tickets) || 0 }),
        },
      ])
    }

    closeModal()
  }

  const handleDelete = (id) => {
    setPerformances((prev) => prev.filter((row) => row.id !== id))

    if (modalState.editingId === id) {
      closeModal()
    }
  }

  const yearOptions = Array.from(
    new Set(performances.map((row) => row.startDate?.slice(0, 4)).filter(Boolean)),
  ).sort()

  const filteredPerformances =
    filterYear === 'all'
      ? performances
      : performances.filter((row) => row.startDate?.startsWith(filterYear))

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
        <div className="table-toolbar">
          <div>
            <h2 style={{ margin: 0 }}>Raspored predstava</h2>
            <p className="muted" style={{ marginTop: 6, fontSize: 14 }}>
              Dodajte, uredite ili uklonite predstave iz repertoara.
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
                <th>Ime</th>
                <th>Status</th>
                <th>Početni datum</th>
                <th>Satnica</th>
                <th>Kategorija</th>
                <th>Broj ulaznica</th>
                <th>QR kod</th>
                <th>Uredi</th>
                <th>Obriši</th>
              </tr>
            </thead>
            <tbody>
              {filteredPerformances.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`status-badge ${row.status === 'Aktivna' ? 'ok' : 'warn'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.startDate}</td>
                  <td>{row.satnica}</td>
                  <td>{row.category || '—'}</td>
                  <td>{row.tickets ?? '—'}</td>
                  <td>
                    {row.qrCode ? (
                      <img className="qr-thumb" src={row.qrCode} alt={`QR ${row.name}`} />
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
                    <Label htmlFor="name">Ime</Label>
                    <Input
                      id="name"
                      value={formValues.name}
                      onChange={(event) => handleInputChange('name', event.target.value)}
                      placeholder="Naziv predstave"
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="sh-input"
                      value={formValues.status}
                      onChange={(event) => handleInputChange('status', event.target.value)}
                    >
                      <option value="Aktivna">Aktivna</option>
                      <option value="Pauzirana">Pauzirana</option>
                    </select>
                  </div>

                  <div className="field">
                    <Label htmlFor="startDate">Početni datum</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formValues.startDate}
                      onChange={(event) => handleInputChange('startDate', event.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="satnica">Satnica</Label>
                    <Input
                      id="satnica"
                      type="time"
                      value={formValues.satnica}
                      onChange={(event) => handleInputChange('satnica', event.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="category">Kategorija</Label>
                    <Input
                      id="category"
                      value={formValues.category}
                      onChange={(event) => handleInputChange('category', event.target.value)}
                      placeholder="Drama, komedija..."
                      required
                    />
                  </div>

                  <div className="field">
                    <Label htmlFor="tickets">Broj ulaznica</Label>
                    <Input
                      id="tickets"
                      type="number"
                      min="0"
                      value={formValues.tickets}
                      onChange={(event) => handleInputChange('tickets', event.target.value)}
                      placeholder="Na primer 120"
                    />
                  </div>
                </div>

                <div className="form-actions modal-actions">
                  <Button variant="outline" type="button" onClick={handleGenerateQr}>
                    Generiši QR
                  </Button>
                  <Button variant="ghost" type="button" onClick={closeModal}>
                    Otkaži
                  </Button>
                  <Button type="submit">
                    {modalState.mode === 'edit' ? 'Sačuvaj izmene' : 'Dodaj predstavu'}
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
