import { notFound } from 'next/navigation'
import { getNotifications, buildChannelSummaries } from '@/lib/api'
import ChatRoom from '@/components/ui/ChatRoom'

interface ChatRoomPageProps {
  params: Promise<{ channelId: string }>
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { channelId: rawChannelId } = await params
  // 라우트 파라미터가 percent-encoding된 채로 넘어오는 경우가 있어 명시적으로 디코딩한다
  const channelId = decodeURIComponent(rawChannelId)

  const notifications = await getNotifications()
  const channelSummaries = buildChannelSummaries(notifications)

  const channel = channelSummaries.find((c) => c.id === channelId)
  if (!channel) notFound()

  // 해당 채널의 알림만 우측 패널에 표시
  const channelNotifications = notifications.filter(
    (n) => `${n.integrationId}:${n.channel ?? '__dm__'}` === channelId
  )

  return (
    <ChatRoom
      channel={channel}
      messages={[]}
      notifications={channelNotifications}
    />
  )
}
