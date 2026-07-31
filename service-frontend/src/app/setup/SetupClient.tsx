'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TEMP_USER_ID } from '@/lib/api'
import type { Provider, ConnectionCounts } from './types'
import StepIndicator from './StepIndicator'
import IntroStep from './steps/IntroStep'
import MessengerStep from './steps/MessengerStep'
import CalendarStep from './steps/CalendarStep'

interface BackendIntegration {
  provider: string
}

const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira', 'google_calendar']

async function fetchConnectionCountsFromBackend(): Promise<ConnectionCounts> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) return {}

  try {
    const res = await fetch(`${backendUrl}/api/v1/integrations`, {
      headers: { 'X-Cochat-User-Id': String(TEMP_USER_ID) },
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json() as { integrations?: BackendIntegration[] }
    const counts: ConnectionCounts = {}
    for (const integration of data.integrations ?? []) {
      if (!(VALID_PROVIDERS as string[]).includes(integration.provider)) continue
      const provider = integration.provider as Provider
      counts[provider] = (counts[provider] ?? 0) + 1
    }
    return counts
  } catch {
    return {}
  }
}

// [백엔드 연결] 이 함수의 fetch URL을 실제 백엔드 엔드포인트로 교체하세요.
// 현재는 목업 route handler(/api/integrations/[provider]/auth)를 호출합니다.
async function getIntegrationAuthUrl(provider: Provider): Promise<string> {
  const res = await fetch(`/api/integrations/${provider}/auth`)
  if (!res.ok) throw new Error(`연동 URL 요청 실패: ${res.status}`)
  const data = await res.json() as { url: string }
  return data.url
}

/** OAuth 라운드트립으로 돌아왔을 때 어느 단계를 보여줄지 provider로부터 판단 */
function stepForProvider(provider: Provider | null): 0 | 1 | 2 {
  if (provider === 'google_calendar') return 2
  if (provider === 'slack' || provider === 'discord' || provider === 'jira') return 1
  return 0
}

interface SetupClientProps {
  initialProvider: Provider | null
  initialConnected: Provider[]
  initialError?: string | null
}

export default function SetupClient({ initialProvider, initialConnected, initialError = null }: SetupClientProps) {
  const router = useRouter()

  const [step, setStep] = useState<0 | 1 | 2>(() => stepForProvider(initialProvider))

  // 방금 돌아온 라운드트립의 provider는 우선 1개로 낙관적 표시하고,
  // 마운트 직후 백엔드 실제 개수로 덮어쓴다.
  const [connectionCounts, setConnectionCounts] = useState<ConnectionCounts>(() =>
    Object.fromEntries(initialConnected.map((provider) => [provider, 1]))
  )
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(initialError)

  useEffect(() => {
    let cancelled = false

    fetchConnectionCountsFromBackend().then((counts) => {
      if (!cancelled) setConnectionCounts(counts)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const isAnyConnected = Object.values(connectionCounts).some((count) => (count ?? 0) > 0)

  async function handleConnect(provider: Provider) {
    setError(null)
    setLoading(provider)
    try {
      const url = await getIntegrationAuthUrl(provider)
      // 외부 OAuth URL로 리다이렉트 (Next.js router 대신 window.location 사용)
      window.location.href = url
    } catch (e) {
      setError(e instanceof Error ? e.message : '연결 중 오류가 발생했습니다.')
      setLoading(null)
    }
  }

  function goToStep(next: 0 | 1 | 2) {
    setError(null)
    setStep(next)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-gray-default)]">
      <div className="flex flex-1 flex-col items-center gap-10 px-[var(--spacing-md)] pt-12 sm:px-[var(--spacing-xl)] sm:pt-20">
        <StepIndicator currentStep={step} />

        {step === 0 && <IntroStep onNext={() => goToStep(1)} />}

        {step === 1 && (
          <MessengerStep
            connectionCounts={connectionCounts}
            loading={loading}
            error={error}
            onConnect={handleConnect}
            onBack={() => goToStep(0)}
            onNext={() => goToStep(2)}
          />
        )}

        {step === 2 && (
          <CalendarStep
            connectionCounts={connectionCounts}
            loading={loading}
            error={error}
            canFinish={isAnyConnected}
            onConnect={handleConnect}
            onBack={() => goToStep(1)}
            onFinish={() => router.push('/dashboard')}
          />
        )}
      </div>
    </div>
  )
}
