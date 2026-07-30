/** 집중모드 세션 종료 API 호출 (Next.js 프록시 라우트 경유, /api/focus-sessions/[id]) */
export async function endFocusSession(sessionId: number): Promise<void> {
  try {
    const res = await fetch(`/api/focus-sessions/${sessionId}`, { method: 'PATCH' })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[focusSession] 세션 종료 실패 (id=${sessionId}, status=${res.status})`, body)
    }
  } catch (error) {
    // 네트워크 레벨 실패 - 로컬 상태는 그대로 리셋하되 원인은 남긴다
    console.error(`[focusSession] 세션 종료 요청 실패 (id=${sessionId})`, error)
  }
}

interface ActiveFocusSession {
  sessionId: number
  startedAt: string
  selectedDuration: 30 | 60 | 90 | null
}

const VALID_DURATIONS = [30, 60, 90] as const

function toSelectedDuration(value: number | null): 30 | 60 | 90 | null {
  return (VALID_DURATIONS as readonly number[]).includes(value as number) ? (value as 30 | 60 | 90) : null
}

/**
 * 서버에 진행 중인 집중 세션이 있는지 조회 (Next.js 프록시 라우트 경유, /api/focus-sessions/active).
 * 다른 브라우저/시크릿 모드/localStorage 삭제 등으로 로컬 상태가 비어있을 때 세션을 복원하는 용도.
 * 활성 세션이 없으면(404) null을 반환한다.
 */
export async function getActiveFocusSession(): Promise<ActiveFocusSession | null> {
  try {
    const res = await fetch('/api/focus-sessions/active')
    if (res.status === 404) return null
    if (!res.ok) {
      const body = await res.text()
      console.error(`[focusSession] 활성 세션 조회 실패 (status=${res.status})`, body)
      return null
    }
    const data = await res.json() as { session_id: number; started_at: string; planned_duration_minutes: number | null }
    return {
      sessionId: data.session_id,
      startedAt: data.started_at,
      selectedDuration: toSelectedDuration(data.planned_duration_minutes),
    }
  } catch (error) {
    console.error('[focusSession] 활성 세션 조회 요청 실패', error)
    return null
  }
}
