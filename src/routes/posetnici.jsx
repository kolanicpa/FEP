import { createFileRoute } from '@tanstack/react-router'
import PoseticiniPage from '@/pages/posetnici'

export const Route = createFileRoute('/posetnici')({
  component: PoseticiniPage,
})
