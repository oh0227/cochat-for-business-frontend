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
