import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { SideNav } from '@/widgets/side-nav'
import './styles/index.css'

function App() {
  const location = useLocation()

  // Don't show sidebar on login page
  const showSidebar = location.pathname !== '/'

  return (
    <>
      {showSidebar && (
        <header className="topbar">
          <div className="brand">
            <span className="brand-dot" />
            <span>FEP Web</span>
          </div>
          <nav className="nav">
            <Link
              to="/home"
              activeProps={{ className: 'nav-link active' }}
              inactiveProps={{ className: 'nav-link' }}
            >
              Home
            </Link>
            <Link
              to="/predstave"
              activeProps={{ className: 'nav-link active' }}
              inactiveProps={{ className: 'nav-link' }}
            >
              Predstave
            </Link>
            <Link
              to="/posetnici"
              activeProps={{ className: 'nav-link active' }}
              inactiveProps={{ className: 'nav-link' }}
            >
              Posetnici
            </Link>
          </nav>
        </header>
      )}

      {showSidebar ? (
        <main className="layout two-col">
          <SideNav />
          <div className="content-col">
            <Outlet />
          </div>
        </main>
      ) : (
        <Outlet />
      )}

      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

export default App
