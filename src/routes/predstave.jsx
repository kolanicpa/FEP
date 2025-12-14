import { createFileRoute } from '@tanstack/react-router'
import PredstavePage from '@/pages/predstave'

export const Route = createFileRoute('/predstave')({
  component: PredstavePage,
})
