import SetupClient from './SetupClient'
import type { Provider } from './types'

const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira', 'google_calendar']

interface SetupPageProps {
  searchParams: Promise<{ provider?: string; status?: string }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { provider, status } = await searchParams

  const initialProvider: Provider | null =
    provider && (VALID_PROVIDERS as string[]).includes(provider) ? (provider as Provider) : null

  // 이번 라운드트립에서 막 연동 완료된 provider (있다면 1개). 이전에 연동한
  // provider까지 포함한 누적 목록은 클라이언트(SetupClient)가 마운트 직후
  // 백엔드 GET /api/v1/integrations로 다시 조회해서 덮어쓴다.
  const initialConnected: Provider[] = status === 'connected' && initialProvider ? [initialProvider] : []

  const initialError =
    status === 'error' && initialProvider ? `${initialProvider} 연동 중 오류가 발생했습니다. 다시 시도해주세요.` : null

  return <SetupClient initialProvider={initialProvider} initialConnected={initialConnected} initialError={initialError} />
}
