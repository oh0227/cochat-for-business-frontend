/** 집중모드 세션 종료 API 호출 (Next.js 프록시 라우트 경유, /api/focus-sessions/[id]) */
export async function endFocusSession(sessionId: number): Promise<void> {
  try {
    await fetch(`/api/focus-sessions/${sessionId}`, { method: 'PATCH' })
  } catch {
    // 종료 실패 시 조용히 처리 - 로컬 상태는 그대로 리셋한다
  }
}
