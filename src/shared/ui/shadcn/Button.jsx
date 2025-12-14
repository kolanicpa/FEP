import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from './utils'

const Button = forwardRef(
  ({ className, variant = 'default', asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const variantClass =
      variant === 'ghost'
        ? 'sh-button-ghost'
        : variant === 'outline'
          ? 'sh-button-outline'
          : 'sh-button-default'

    return (
      <Comp
        ref={ref}
        className={cn('sh-button', variantClass, className)}
        type={type}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button }
