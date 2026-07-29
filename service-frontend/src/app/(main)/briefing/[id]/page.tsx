import { notFound } from 'next/navigation'
import { getBriefingById, getNotifications } from '@/lib/api'
import { getNotificationIds, toBriefing } from '@/lib/briefing'
import BriefingDetailView from '@/components/ui/BriefingDetailView'

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [data, notifications] = await Promise.all([getBriefingById(id), getNotifications()])
  if (!data) notFound()

  const briefing = toBriefing(data)
  const relatedNotifications = notifications.filter((n) => getNotificationIds(data).includes(Number(n.id)))

  return <BriefingDetailView briefing={briefing} notifications={relatedNotifications} />
}
