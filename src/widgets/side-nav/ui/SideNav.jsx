import { Home, Layers3, PanelsTopLeft, ScanLine, List, Users } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const items = [
  {
    label: 'Predstave',
    to: '/predstave',
    icon: List,
    description: 'Navigate to the shadcn table of productions.',
  },
  {
    label: 'Posetnici',
    to: '/posetnici',
    icon: Users,
    description: 'Manage attendees and send tickets with QR codes.',
  },
]

const SideNav = () => (
  <aside className="sh-sidebar">
    <div className="sh-sidebar-header">
      <p className="pill subtle">Sections</p>
    </div>
    <nav className="sh-sidebar-links">
      {items.map(({ label, href, to, description, icon: Icon }) => (
        <div key={to || href} className="sh-sidebar-item">
          {to ? (
            <Link className="sh-sidebar-link" to={to} from="/home">
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ) : (
            <a className="sh-sidebar-link" href={href}>
              <Icon size={16} />
              <span>{label}</span>
            </a>
          )}
          <p className="sh-sidebar-desc">{description}</p>
        </div>
      ))}
    </nav>
  </aside>
)

export { SideNav }
