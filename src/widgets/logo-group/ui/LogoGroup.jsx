import reactLogo from '@/shared/assets/react.svg'

const Logo = ({ href, alt, src }) => (
  <a href={href} target="_blank" rel="noreferrer" className="logo">
    <img src={src} alt={alt} />
  </a>
)

const LogoGroup = () => (
  <section>
    <p className="muted">Powered by modern tooling</p>
    <div className="logo-panel">
      <Logo href="https://vite.dev" alt="Vite logo" src="/vite.svg" />
      <Logo href="https://react.dev" alt="React logo" src={reactLogo} />
    </div>
  </section>
)

export { LogoGroup }
