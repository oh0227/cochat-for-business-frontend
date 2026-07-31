import type { IconType } from 'react-icons'
import { FaSlack } from 'react-icons/fa6'
import { SiDiscord, SiJira, SiGooglecalendar, SiGmail, SiKakaotalk, SiLine, SiTelegram, SiNaver, SiApple } from 'react-icons/si'

export type ProviderKey =
  | 'slack'
  | 'discord'
  | 'jira'
  | 'google_calendar'
  | 'gmail'
  // 추후지원 예정(아직 실제 연동은 안 되고 셋업 온보딩에 노출만 됨)
  | 'kakaowork'
  | 'naverworks'
  | 'telegram'
  | 'naver_calendar'
  | 'apple_calendar'

interface ProviderMeta {
  name: string
  Icon: IconType
  color: string
  bg: string
}

// simple-icons(react-icons/si)는 상표 문제로 Slack 로고를 제공하지 않아 Font Awesome의
// 공식 Slack 아이콘을 대신 쓴다. 나머지는 전부 simple-icons의 실제 브랜드 로고.
export const PROVIDER_ICON_META: Record<ProviderKey, ProviderMeta> = {
  slack: { name: 'Slack', Icon: FaSlack, color: '#4A154B', bg: 'rgba(74,21,75,0.1)' },
  discord: { name: 'Discord', Icon: SiDiscord, color: '#5865F2', bg: 'rgba(88,101,242,0.1)' },
  jira: { name: 'Jira', Icon: SiJira, color: '#0052CC', bg: 'rgba(0,82,204,0.1)' },
  google_calendar: { name: 'Google Calendar', Icon: SiGooglecalendar, color: '#4285F4', bg: 'rgba(66,133,244,0.1)' },
  gmail: { name: 'Gmail', Icon: SiGmail, color: '#EA4335', bg: 'rgba(234,67,53,0.1)' },
  kakaowork: { name: '카카오워크', Icon: SiKakaotalk, color: '#3C1E1E', bg: 'rgba(254,229,0,0.35)' },
  naverworks: { name: '네이버웍스', Icon: SiLine, color: '#06C755', bg: 'rgba(6,199,85,0.1)' },
  telegram: { name: 'Telegram', Icon: SiTelegram, color: '#26A5E4', bg: 'rgba(38,165,228,0.1)' },
  naver_calendar: { name: '네이버 캘린더', Icon: SiNaver, color: '#03C75A', bg: 'rgba(3,199,90,0.1)' },
  apple_calendar: { name: 'Apple Calendar', Icon: SiApple, color: '#86868B', bg: 'rgba(134,134,139,0.16)' },
}

interface ProviderIconProps {
  provider: ProviderKey
  size?: number
  className?: string
  color?: string
}

/** provider별 실제 브랜드 로고 아이콘. 색상을 지정하지 않으면 브랜드 컬러를 그대로 쓴다. */
export function ProviderIcon({ provider, size = 16, className, color }: ProviderIconProps) {
  const { Icon, color: brandColor } = PROVIDER_ICON_META[provider]
  return <Icon size={size} color={color ?? brandColor} className={className} />
}
