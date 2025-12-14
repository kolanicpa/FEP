import { forwardRef } from 'react'
import { cn } from './utils'

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input ref={ref} type={type} className={cn('sh-input', className)} {...props} />
))

Input.displayName = 'Input'

export { Input }
