import AppShell from '@/components/layout/AppShell'
import DeepWorkTimer from '@/components/layout/DeepWorkTimer'
import NotificationStream from '@/components/layout/NotificationStream'
import CalendarPromptModal from '@/components/layout/CalendarPromptModal'
import { getNotifications } from '@/lib/api'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const notifications = await getNotifications()
  const unreadCount = notifications.filter((n) => n.status === 'unread').length

  return (
    <>
      <NotificationStream />
      <DeepWorkTimer />
      <CalendarPromptModal />
      <AppShell unreadCount={unreadCount}>{children}</AppShell>
    </>
  )
}
