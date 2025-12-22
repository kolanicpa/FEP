import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { SideNav } from '@/widgets/side-nav'

const HomePage = () => (
  <>
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <span>FEP Web</span>
      </div>
      <nav className="nav">
        <Link
          to="/"
          activeProps={{ className: 'nav-link active' }}
          inactiveProps={{ className: 'nav-link' }}
        >
          Login
        </Link>
        <Link
          to="/home"
          activeProps={{ className: 'nav-link active' }}
          inactiveProps={{ className: 'nav-link' }}
        >
          Home
        </Link>
      </nav>
    </header>

    <main className="layout two-col">
      <SideNav />

      <div className="content-col">
        <section id="overview" className="hero">
          <div>
            <p className="pill">
              Festival <strong>Management</strong>
            </p>
            <h1>Dobrodošli u FEP sistem</h1>
            <p>
              Sistem za upravljanje pozorišnim predstavama i festivalskim performansima. Pratite
              izvođače, upravljajte rasporedom i izdajte ulaznice - sve na jednom mestu.
            </p>
            <div className="actions hero-actions">
              <Link to="/predstave">
                <Button>Pogledaj predstave</Button>
              </Link>
              <Link to="/ulaznice">
                <Button variant="ghost">Ulaznice</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features">
          <Card title="Mogućnosti sistema">
            <div className="card-grid">
              <div>
                <strong>Predstave</strong>
                <p className="muted">Upravljanje performansima, izvođačima i rasporedima</p>
              </div>
              <div>
                <strong>Ulaznice</strong>
                <p className="muted">Izdavanje i praćenje ulaznica sa QR kodovima</p>
              </div>
              <div>
                <strong>Festival program</strong>
                <p className="muted">Organizacija i planiranje festival rasporeda</p>
              </div>
              <div>
                <strong>Izvođači</strong>
                <p className="muted">Baza izvođača i bendova</p>
              </div>
              <div>
                <strong>Analitika</strong>
                <p className="muted">Praćenje prodaje i posećenosti</p>
              </div>
              <div>
                <strong>Lokacije</strong>
                <p className="muted">Upravljanje mestima izvođenja predstava</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="quick-stats">
          <Card title="Brzi pregled">
            <div style={{ padding: '20px' }}>
              <p className="muted" style={{ textAlign: 'center', fontSize: '16px' }}>
                Koristite navigaciju sa leve strane za pristup različitim delovima sistema.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </main>
  </>
)

export { HomePage }
