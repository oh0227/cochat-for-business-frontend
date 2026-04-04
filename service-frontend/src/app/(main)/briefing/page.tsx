import { getLatestBriefing } from '@/lib/api'
import BriefingListClient, { type BriefingItem } from '@/components/ui/BriefingListClient'
import type { Briefing } from '@/types'

export default async function BriefingPage() {
  const latest = await getLatestBriefing()

  const initialItems: BriefingItem[] = latest
    ? [
        {
          briefing: {
            id: String(latest.id),
            sessionId: String(latest.session_id),
            title: latest.title,
            content: latest.content,
            actionItems: [],
            highlights: [],
            criticalCount: 0,
            highCount: 0,
            mediumCount: 0,
            generatedAt: latest.created_at,
          } satisfies Briefing,
          providerCounts: {},
        },
      ]
    : []

  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      <BriefingListClient initialItems={initialItems} />
    </div>
  )
}
