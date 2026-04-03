/** 날짜/시간 포맷 유틸 함수 */

/**
 * ISO 8601 문자열을 상대 시간으로 변환합니다.
 * 예: "42분 전", "3시간 전", "어제", "2일 전"
 */
export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  const days = Math.floor(hours / 24)
  if (days === 1) return '어제'
  return `${days}일 전`
}

/**
 * ISO 8601 문자열을 한국어 날짜로 변환합니다.
 * 예: "2026년 4월 3일"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoString))
}

/**
 * ISO 8601 문자열을 시:분으로 변환합니다.
 * 예: "14:30"
 */
export function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(isoString))
}
