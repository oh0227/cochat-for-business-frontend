import { getBriefings, getNotifications } from '@/lib/api'
import { buildProviderCounts, getNotificationIds, toBriefing } from '@/lib/briefing'
import BriefingListClient, { type BriefingItem } from '@/components/ui/BriefingListClient'

export default async function BriefingPage() {
  const [briefings, notifications] = await Promise.all([getBriefings(), getNotifications()])

  const initialItems: BriefingItem[] = briefings.map((raw) => ({
    briefing: toBriefing(raw),
    providerCounts: buildProviderCounts(
      notifications.filter((n) => getNotificationIds(raw).includes(Number(n.id)))
    ),
  }))

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <BriefingListClient initialItems={initialItems} />
    </div>
  )
}
