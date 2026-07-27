import SetupClient from './SetupClient'

type Provider = 'slack' | 'discord' | 'jira'
const VALID_PROVIDERS: Provider[] = ['slack', 'discord', 'jira']

interface SetupPageProps {
  searchParams: Promise<{ provider?: string; status?: string }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { provider, status } = await searchParams

  // 이번 라운드트립에서 막 연동 완료된 provider (있다면 1개).
  // 백엔드의 연동 목록 조회(GET /api/v1/integrations)는 아직 항상 빈 배열만
  // 반환하는 미구현 스텁이라 신뢰할 수 없다 (issue #14 참고) — 그래서 이전에
  // 연동한 provider까지 포함한 누적 목록은 클라이언트(SetupClient)에서
  // localStorage로 직접 관리한다.
  const initialConnected: Provider[] =
    status === 'connected' && provider && (VALID_PROVIDERS as string[]).includes(provider)
      ? [provider as Provider]
      : []

  const initialError =
    status === 'error' && provider
      ? `${provider} 연동 중 오류가 발생했습니다. 다시 시도해주세요.`
      : null

  return <SetupClient initialConnected={initialConnected} initialError={initialError} />
}
