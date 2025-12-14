import { Link } from '@tanstack/react-router'
import { CounterCard } from '@/features/counter'
import { LogoGroup } from '@/widgets/logo-group'
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
              Feature Driven Development <strong>starter</strong>
            </p>
            <h1>Vite + React scaffolded for FDD</h1>
            <p>
              The app shell, widgets, features, and shared UI are split into clear layers so you can
              grow the project without rewrites.
            </p>
            <div className="actions hero-actions">
              <Link to="/">
                <Button>Try the login flow</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost">Auth route</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="structure">
          <Card title="Structure">
            <div className="card-grid">
              <div>
                <strong>app/</strong>
                <p className="muted">entry point, routes, global styles & providers</p>
              </div>
              <div>
                <strong>pages/</strong>
                <p className="muted">route-level composition of widgets/features</p>
              </div>
              <div>
                <strong>widgets/</strong>
                <p className="muted">page sections built from features/shared UI</p>
              </div>
              <div>
                <strong>features/</strong>
                <p className="muted">isolated business capabilities</p>
              </div>
              <div>
                <strong>shared/</strong>
                <p className="muted">reusable UI primitives, assets, helpers</p>
              </div>
            </div>
          </Card>
        </section>

        <section id="counter">
          <CounterCard />
        </section>

        <section id="brands">
          <LogoGroup />
        </section>
      </div>
    </main>
  </>
)

export { HomePage }
