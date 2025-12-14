import { useState } from 'react'

const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((value) => value + 1)
  const reset = () => setCount(initialValue)

  return { count, increment, reset }
}

export { useCounter }
