'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { Briefing, NotificationProvider } from '@/types'
import BriefingCard from './BriefingCard'

export interface BriefingItem {
  briefing: Briefing
  providerCounts: Partial<Record<NotificationProvider, number>>
}

// [백엔드 연결] 백엔드 응답 스펙에 맞게 이 인터페이스를 수정하세요.
// - 백엔드가 providerCounts를 내려주지 않는다면 이 필드를 제거하고
//   handleGetBriefing() 안에서 getProviderCounts(result.briefing.highlights)로 직접 계산하세요.
// - 응답 필드명이 다를 경우 (예: snake_case) 필드명을 맞게 수정하세요.
interface GenerateBriefingResponse {
  briefing: Briefing
  providerCounts: Partial<Record<NotificationProvider, number>>
}

// [백엔드 연결] 브리핑 생성 API 호출 함수
// 현재는 Next.js Route Handler(목업)를 호출합니다.
// 실제 백엔드 연결 시 아래 항목을 수정하세요:
//   1. URL: '/api/briefings/generate' → 실제 백엔드 엔드포인트
//   2. 인증 헤더: Authorization 주석을 해제하고 토큰을 주입
//   3. body 필드명: 백엔드 스펙에 맞게 수정 (예: sinceAt → since)
async function generateBriefing(sinceAt: string): Promise<GenerateBriefingResponse> {
  const res = await fetch('/api/briefings/generate', { // [백엔드 연결] URL 교체
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // [백엔드 연결] 인증 토큰이 필요한 경우 아래 주석을 해제하세요.
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sinceAt }), // [백엔드 연결] body 필드명/구조를 백엔드 스펙에 맞게 수정
  })
  if (!res.ok) {
    // [백엔드 연결] 백엔드가 JSON 에러 응답을 내려준다면 res.json()으로 파싱 후 message 필드를 추출하세요.
    const message = await res.text().catch(() => '알 수 없는 오류가 발생했습니다.')
    throw new Error(message)
  }
  return res.json()
}

interface BriefingListClientProps {
  initialItems: BriefingItem[]
}

export default function BriefingListClient({ initialItems }: BriefingListClientProps) {
  const [items, setItems] = useState<BriefingItem[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGetBriefing() {
    setLoading(true)
    setError(null)
    // [백엔드 연결] sinceAt: 목록 최상단(최신) 브리핑의 generatedAt을 기준으로 그 이후 메시지를 분석 요청합니다.
    // 브리핑이 하나도 없는 경우 epoch(new Date(0))를 전달해 전체 메시지를 분석합니다.
    const sinceAt = items[0]?.briefing.generatedAt ?? new Date(0).toISOString()
    try {
      const result = await generateBriefing(sinceAt)
      // [백엔드 연결] 응답 구조가 다를 경우 여기서 변환 로직을 추가하세요.
      // 예) providerCounts를 직접 계산: getProviderCounts(result.briefing.highlights)
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
      <div className="flex items-start justify-between">
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
