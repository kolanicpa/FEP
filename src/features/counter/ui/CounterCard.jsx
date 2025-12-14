import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useCounter } from '../model/useCounter'

const CounterCard = () => {
  const { count, increment, reset } = useCounter()

  return (
    <Card title="Counter feature">
      <p className="muted">
        This lives in <strong>features/counter</strong> to keep behavior close to UI.
      </p>
      <div className="counter-row">
        <span className="count">{count}</span>
        <div className="actions">
          <Button onClick={increment}>Increment</Button>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}

export { CounterCard }
