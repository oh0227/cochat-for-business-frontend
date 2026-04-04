import { getNotifications } from '@/lib/api'
import DeepWorkClient from '@/components/ui/DeepWorkClient'

export default async function DeepWorkPage() {
  const notifications = await getNotifications()

  const urgentNotifications = notifications.filter((n) => n.priority === 'critical')
  const pendingCount = notifications.filter(
    (n) => n.priority !== 'critical' && n.status === 'unread'
  ).length

  return (
    <DeepWorkClient
      initialUrgentNotifications={urgentNotifications}
      initialPendingCount={pendingCount}
    />
  )
}
