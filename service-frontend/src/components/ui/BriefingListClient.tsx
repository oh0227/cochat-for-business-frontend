'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Briefing, NotificationProvider } from '@/types'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { toBriefing, type BackendBriefing } from '@/lib/briefing'
import BriefingCard from './BriefingCard'

export interface BriefingItem {
  briefing: Briefing
  providerCounts: Partial<Record<NotificationProvider, number>>
}

interface BackendBriefingResponse extends BackendBriefing {
  provider_counts: Partial<Record<NotificationProvider, number>>
}

async function createBriefingFromSession(sessionId: number): Promise<BriefingItem> {
  const res = await fetch('/api/briefings/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!res.ok) {
    const message = await res.text().catch(() => '브리핑 생성에 실패했습니다.')
    throw new Error(message)
  }
  const data = await res.json() as BackendBriefingResponse
  return {
    briefing: toBriefing(data),
    providerCounts: data.provider_counts,
  }
}

interface BriefingListClientProps {
  initialItems: BriefingItem[]
}

export default function BriefingListClient({ initialItems }: BriefingListClientProps) {
  const [items, setItems] = useState<BriefingItem[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionId = useDeepWorkStore((s) => s.sessionId)

  async function handleGetBriefing() {
    if (!sessionId) {
      setError('집중 모드 세션 이후에 브리핑을 받을 수 있습니다.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await createBriefingFromSession(sessionId)
      setItems((prev) => [result, ...prev])
    } catch (e) {
      setError(e instanceof Error ? e.message : '브리핑 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-[var(--spacing-sm)] sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-[var(--spacing-4xs)]">
          <h1
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' }}
          >
            브리핑
          </h1>
          <p
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            모든 알림을 확인하고 관리하세요.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleGetBriefing}
          className="flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] px-[var(--spacing-sm)] py-[var(--spacing-2xs)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? '분석 중...' : '브리핑 받기'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p
          className="rounded-[var(--radius-xs)] bg-[var(--color-urgent-50)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-urgent-500)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {error}
        </p>
      )}

      {/* 최근 브리핑 목록 */}
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p
          className="font-semibold text-[var(--color-gray-900)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          최근 브리핑
        </p>
        <div className="flex flex-col gap-[var(--spacing-xs)]">
          {items.map(({ briefing, providerCounts }) => (
            <BriefingCard key={briefing.id} briefing={briefing} providerCounts={providerCounts} />
          ))}
        </div>
      </div>
    </>
  )
}
