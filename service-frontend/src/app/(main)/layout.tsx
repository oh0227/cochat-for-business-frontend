import Sidebar from '@/components/layout/Sidebar'
import DeepWorkTimer from '@/components/layout/DeepWorkTimer'
import NotificationStream from '@/components/layout/NotificationStream'
import { getNotifications } from '@/lib/api'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const notifications = await getNotifications()
  const unreadCount = notifications.filter((n) => n.status === 'unread').length

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-50)]">
      <NotificationStream />
      <DeepWorkTimer />
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-y-auto p-[var(--spacing-lg)]">{children}</main>
    </div>
  )
}
