'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, X, AlarmClock, Bell, Sparkles, Shield, MessageSquare, Loader2 } from 'lucide-react'
import type { Notification, NotificationProvider } from '@/types'
import { formatRelativeTime } from '@/utils'
import { useDeepWorkStore } from '@/store/deepWorkStore'
import { endFocusSession } from '@/lib/focusSession'

type Duration = 30 | 60 | 90

const DURATIONS: Duration[] = [30, 60, 90]

const PROVIDER_COLOR: Record<NotificationProvider, string> = {
  slack: 'bg-[#4a154b]',
  discord: 'bg-[#5865f2]',
  jira: 'bg-[#0052cc]',
  gmail: 'bg-[#ea4335]',
}

const PROVIDER_NAME: Record<NotificationProvider, string> = {
  slack: 'Slack',
  discord: 'Discord',
  jira: 'Jira',
  gmail: 'Gmail',
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

async function startFocusSession(plannedDurationMinutes: number): Promise<number | null> {
  try {
    const res = await fetch('/api/focus-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plannedDurationMinutes }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[DeepWorkClient] 세션 시작 실패 (status=${res.status})`, body)
      return null
    }
    const data = await res.json() as { session_id: number }
    return data.session_id ?? null
  } catch (error) {
    console.error('[DeepWorkClient] 세션 시작 요청 실패', error)
    return null
  }
}

async function createBriefing(sessionId: number): Promise<{ ok: boolean }> {
  const res = await fetch('/api/briefings/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  })
  if (!res.ok) throw new Error('브리핑 생성에 실패했습니다.')
  return { ok: true }
}

interface DeepWorkClientProps {
  // [백엔드 연결] 읽지 않은 알림 전체 (서버에서 주입, 세션 범위 필터링은 클라이언트에서 수행)
  initialUnreadNotifications: Notification[]
}

export default function DeepWorkClient({
  initialUnreadNotifications,
}: DeepWorkClientProps) {
  const router = useRouter()

  // 집중모드 전역 상태 (페이지 이동과 무관하게 유지)
  const { isRunning, elapsed, selectedDuration, sessionStartedAt, noNewAlerts, start, end, setNoNewAlerts, consumeModalPending } = useDeepWorkStore()

  // 모달·로딩은 이 페이지 내에서만 필요한 로컬 상태
  // 대시보드 [시작하기]로 진입한 경우 pendingOpenModal 플래그를 초기값으로 읽어 바로 모달 오픈
  const [showModal, setShowModal] = useState(() => useDeepWorkStore.getState().pendingOpenModal)
  const [selectedModalDuration, setSelectedModalDuration] = useState<Duration | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  // pendingOpenModal 소비(store.set())는 렌더링 단계가 아닌 마운트 후 이펙트에서 처리
  // (렌더링 중 다른 컴포넌트의 setState를 트리거하면 React 경고가 발생함)
  useEffect(() => {
    if (showModal) consumeModalPending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 세션 시작 이후 도착한 알림만 집중모드 화면에 노출한다.
  // [백엔드 연결] 실시간 폴링/웹소켓으로 갱신하기 전까지는 페이지 로드 시점 스냅샷을 그대로 씀.
  const sessionNotifications = sessionStartedAt
    ? initialUnreadNotifications.filter((n) => n.createdAt >= sessionStartedAt)
    : []

  const urgentNotifications = sessionNotifications.filter((n) => n.priority === 'critical')
  const pendingCount = sessionNotifications.filter((n) => n.priority !== 'critical').length

  async function handleStartSession() {
    const duration = selectedModalDuration
    if (duration) {
      const sessionId = await startFocusSession(duration)
      if (!sessionId) {
        setStartError('세션을 시작하지 못했습니다. 이미 진행 중인 세션이 있는지 확인해 주세요.')
        return
      }
      start(duration, new Date().toISOString(), sessionId)
    } else {
      start(null, new Date().toISOString(), null)
    }
    setStartError(null)
    setShowModal(false)
    setSelectedModalDuration(null)
  }

  async function handleEndSession() {
    const sessionId = useDeepWorkStore.getState().sessionId
    if (sessionId) {
      await endFocusSession(sessionId)
    } else {
      console.warn('[DeepWorkClient] sessionId가 없어 세션 종료 API를 호출하지 않음')
    }
    end()
  }

  async function handleRequestBriefing() {
    const sessionId = useDeepWorkStore.getState().sessionId
    if (!sessionId) {
      setNoNewAlerts(true)
      return
    }
    setBriefingLoading(true)
    try {
      await createBriefing(sessionId)
      router.push('/briefing')
    } catch {
      setBriefingLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-[var(--spacing-lg)]">
        {/* 페이지 헤더 */}
        <div className="flex flex-col gap-[var(--spacing-4xs)]">
          <h1
            className="font-semibold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-lg)' }}
          >
            집중 모드
          </h1>
          <p
            className="text-[var(--color-gray-400)]"
            style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
          >
            방해받지 않고 깊은 업무에 집중하세요
          </p>
        </div>

        {!isRunning ? (
          /* ── Idle: 집중 시작 카드 ── */
          <div className="flex min-h-[400px] items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-brand-80)] bg-[var(--color-brand-20)]">
            <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
              <div className="flex flex-col items-center gap-[var(--spacing-2xs)]">
                <p
                  className="font-semibold text-[var(--color-brand-500)]"
                  style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                >
                  집중 시작
                </p>
                <p
                  className="text-center text-[var(--color-gray-500)]"
                  style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                >
                  집중 모드에서는 중요한 알림만 전달되며,<br />
                  나머지 알림은 보류되어 브리핑으로 확인할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStartError(null)
                  setShowModal(true)
                }}
                className="flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] px-[var(--spacing-md)] py-[var(--spacing-2xs)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                <Play size={14} fill="white" />
                집중 시작
              </button>
            </div>
          </div>
        ) : (
          /* ── Running: 집중 진행 중 ── */
          <>
            {/* 타이머 카드 */}
            <div className="flex flex-col items-center gap-[var(--spacing-sm)] rounded-[var(--radius-sm)] border border-[var(--color-brand-80)] bg-[var(--color-brand-20)] px-[var(--spacing-lg)] py-[var(--spacing-xl)]">
              <span
                className="rounded-[var(--radius-8xl)] border border-[var(--color-brand-100)] bg-[var(--color-gray-default)] px-[var(--spacing-xs)] py-[var(--spacing-4xs)] text-[var(--color-gray-500)]"
                style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                집중모드 활성화
                {selectedDuration && ` · ${selectedDuration}분`}
              </span>
              <AlarmClock size={28} className="text-[var(--color-brand-500)]" />
              <p
                className="font-bold tabular-nums text-[var(--color-brand-500)]"
                style={{ fontSize: 'var(--font-size-4xl)', lineHeight: 'var(--line-height-4xl)' }}
              >
                {formatTime(elapsed)}
              </p>
              <button
                type="button"
                onClick={handleEndSession}
                className="flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] border border-[var(--color-gray-100)] bg-[var(--color-gray-default)] px-[var(--spacing-md)] py-[var(--spacing-2xs)] font-medium text-[var(--color-gray-700)] transition-colors hover:bg-[var(--color-gray-50)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                <X size={14} />
                집중 종료
              </button>
            </div>

            {/* 긴급 알림 섹션 */}
            <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)]">
              <div className="flex items-center gap-[var(--spacing-2xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
                <Bell size={18} className="text-[var(--color-urgent-500)]" />
                <p
                  className="font-semibold text-[var(--color-gray-950)]"
                  style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                >
                  확인이 필요한 알림
                  {urgentNotifications.length > 0 && ` (${urgentNotifications.length})`}
                </p>
              </div>
              {urgentNotifications.length === 0 ? (
                <div className="flex items-center justify-center py-[var(--spacing-2xl)]">
                  <p
                    className="text-[var(--color-gray-400)]"
                    style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                  >
                    새로운 알림이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-[var(--spacing-2xs)] px-[var(--spacing-md)] pb-[var(--spacing-md)]">
                  {urgentNotifications.map((n) => (
                    <UrgentNotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )}
            </div>

            {/* 보류 알림 배너 */}
            <PendingBanner
              count={pendingCount}
              loading={briefingLoading}
              noNewAlerts={noNewAlerts}
              onRequestBriefing={handleRequestBriefing}
            />
          </>
        )}
      </div>

      {/* 타이머 설정 모달 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-[var(--radius-md)] bg-[var(--color-gray-default)] p-[var(--spacing-lg)] shadow-lg"
            style={{ width: '480px', maxWidth: 'calc(100vw - 32px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-[var(--spacing-md)]">
              <div className="flex flex-col gap-[var(--spacing-4xs)]">
                <p
                  className="font-semibold text-[var(--color-gray-950)]"
                  style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-xs)' }}
                >
                  타이머 설정
                </p>
                <p
                  className="text-[var(--color-gray-500)]"
                  style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                >
                  시간을 설정하면 자동으로 종료됩니다
                </p>
              </div>
              {startError && (
                <p
                  className="rounded-[var(--radius-xs)] bg-[var(--color-urgent-50)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[var(--color-urgent-500)]"
                  style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
                >
                  {startError}
                </p>
              )}
              <div className="grid grid-cols-3 gap-[var(--spacing-2xs)]">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedModalDuration(d)}
                    className={[
                      'rounded-[var(--radius-xs)] py-[var(--spacing-xs)] font-medium transition-colors',
                      selectedModalDuration === d
                        ? 'bg-[var(--color-gray-inverse)] text-white'
                        : 'border border-[var(--color-gray-100)] bg-[var(--color-gray-default)] text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)]',
                    ].join(' ')}
                    style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
                  >
                    {d}분
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleStartSession}
                className="flex w-full items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] bg-[var(--color-brand-500)] py-[var(--spacing-xs)] font-medium text-white transition-colors hover:bg-[var(--color-brand-600)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                <Play size={14} fill="white" />
                집중 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── 서브 컴포넌트 ──────────────────────────────────────────────────────────

function UrgentNotificationItem({ notification }: { notification: Notification }) {
  const { provider, channel, summary, actor, createdAt } = notification
  return (
    <div className="flex items-start gap-[var(--spacing-xs)] rounded-[var(--radius-xs)] bg-[var(--color-urgent-50)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]">
      <span
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white',
          provider ? PROVIDER_COLOR[provider] : 'bg-[var(--color-gray-400)]',
        ].join(' ')}
      >
        <MessageSquare size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-4xs)]">
        <p
          className="text-[var(--color-brand-500)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {provider ? PROVIDER_NAME[provider] : '메시지'}{channel ? ` › ${channel}` : ''}
        </p>
        <p
          className="font-medium text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {summary}
        </p>
        <p
          className="text-[var(--color-gray-400)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          {actor ?? '알 수 없음'} · {formatRelativeTime(createdAt)}
        </p>
      </div>
    </div>
  )
}

interface PendingBannerProps {
  count: number
  loading: boolean
  // API 422 응답 시(새 알림 없음) true → 버튼 비활성화
  noNewAlerts: boolean
  onRequestBriefing: () => void
}

function PendingBanner({ count, loading, noNewAlerts, onRequestBriefing }: PendingBannerProps) {
  const hasPending = count > 0
  // 보류 알림 없음 / 새 알림 없음 / 로딩 중 → 버튼 비활성화
  const isDisabled = !hasPending || noNewAlerts || loading

  return (
    <div className="flex items-center gap-[var(--spacing-xs)] rounded-[var(--radius-sm)] border border-[var(--color-gray-80)] bg-[var(--color-gray-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-50)]">
        <Shield size={18} className="text-[var(--color-gray-400)]" />
      </span>
      <div className="flex flex-1 flex-col gap-[var(--spacing-4xs)]">
        <p
          className="font-medium text-[var(--color-gray-950)]"
          style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
        >
          {noNewAlerts
            ? '마지막 브리핑 이후 새로운 알림이 없습니다.'
            : hasPending
              ? `현재 ${count}개의 알림이 보류 중입니다`
              : '현재 보류된 알림이 없습니다.'}
        </p>
        <p
          className="text-[var(--color-gray-400)]"
          style={{ fontSize: 'var(--font-size-5xs)', lineHeight: 'var(--line-height-5xs)' }}
        >
          지금까지 보류된 메시지를 브리핑으로 정리해서 확인하세요.
        </p>
      </div>
      {/* [브리핑 받기] 버튼:
          - 보류 알림 없음: 비활성화
          - 마지막 브리핑 이후 새 알림 없음(API 422): 비활성화
          - 브리핑 생성 성공 시 /briefing으로 이동 */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={onRequestBriefing}
        className="flex shrink-0 items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-xs)] px-[var(--spacing-sm)] py-[var(--spacing-2xs)] font-medium transition-colors disabled:cursor-not-allowed"
        style={{
          fontSize: 'var(--font-size-3xs)',
          lineHeight: 'var(--line-height-4xs)',
          backgroundColor: isDisabled ? 'var(--color-gray-80)' : 'var(--color-brand-500)',
          color: isDisabled ? 'var(--color-gray-400)' : 'white',
        }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {loading ? '생성 중...' : '브리핑 받기'}
      </button>
    </div>
  )
}
