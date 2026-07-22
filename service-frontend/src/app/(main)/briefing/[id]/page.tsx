import { notFound } from 'next/navigation'
import { buildBriefingTitle, getBriefingById } from '@/lib/api'
import BriefingDetailView from '@/components/ui/BriefingDetailView'
import type { Briefing } from '@/types'

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await getBriefingById(id)
  if (!data) notFound()

  const briefing: Briefing = {
    id: String(data.briefing_id),
    sessionId: String(data.session_id),
    title: buildBriefingTitle(data.generated_at),
    content: data.content,
    actionItems: [],
    highlights: [],
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    generatedAt: data.generated_at,
  }

  return <BriefingDetailView briefing={briefing} notifications={[]} />
}
