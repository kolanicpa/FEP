import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Card } from '@/shared/ui/Card'
import { Button, Input, Label } from '@/shared/ui/shadcn'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in both fields to continue.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate({ to: '/home' })
    }, 400)
  }

  return (
    <main className="layout narrow">
      <div className="auth-header">
        <p className="pill">
          Account <strong>Access</strong>
        </p>
        <h1>Welcome back</h1>
        <p className="muted">
          Sign in to jump into the demo experience. This flow just redirects you home once the form
          validates.
        </p>
      </div>

      <Card>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <div className="helper-row">
            <span className="muted">Demo login</span>
            <span className="pill subtle">Redirects to home</span>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Redirecting...' : 'Login & go home'}
          </Button>
        </form>
      </Card>

      <p className="muted">
        Just browsing? <Link to="/home">Return home</Link>
      </p>
    </main>
  )
}

export { LoginPage }
