import { getLatestBriefing, getNotifications } from '@/lib/api'
import { buildProviderCounts, getNotificationIds, toBriefing } from '@/lib/briefing'
import BriefingListClient, { type BriefingItem } from '@/components/ui/BriefingListClient'

export default async function BriefingPage() {
  const [latest, notifications] = await Promise.all([getLatestBriefing(), getNotifications()])

  const initialItems: BriefingItem[] = latest
    ? [
        {
          briefing: toBriefing(latest),
          providerCounts: buildProviderCounts(
            notifications.filter((n) => getNotificationIds(latest).includes(Number(n.id)))
          ),
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <BriefingListClient initialItems={initialItems} />
    </div>
  )
}
