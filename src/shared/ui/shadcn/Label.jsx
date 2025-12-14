import * as RadixLabel from '@radix-ui/react-label'
import { cn } from './utils'

const Label = ({ className, ...props }) => (
  <RadixLabel.Root className={cn('sh-label', className)} {...props} />
)

export { Label }
