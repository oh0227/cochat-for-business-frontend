import { getNotifications } from '@/lib/api'
import DeepWorkClient from '@/components/ui/DeepWorkClient'

export default async function DeepWorkPage() {
  const notifications = await getNotifications()

  // 세션 시작 이후 도착한 알림만 걸러야 하는데, 세션 시작 시각은
  // 클라이언트 store(useDeepWorkStore)에만 있어 서버 컴포넌트에서는 알 수 없다.
  // 그래서 읽지 않은 알림 전체를 넘기고, 실제 세션 범위 필터링은 DeepWorkClient에서 한다.
  const unreadNotifications = notifications.filter((n) => n.status === 'unread')

  return <DeepWorkClient initialUnreadNotifications={unreadNotifications} />
}
