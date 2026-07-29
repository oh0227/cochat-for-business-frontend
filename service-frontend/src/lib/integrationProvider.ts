/**
 * 프론트 provider 식별자(GET /integrations 응답의 provider 필드값, 언더스코어)를
 * 백엔드 OAuth 라우트 세그먼트(하이픈)로 변환한다.
 * slack/discord/jira는 provider 값과 경로 세그먼트가 동일해 변환이 필요 없다.
 */
const PROVIDER_TO_OAUTH_SLUG: Record<string, string> = {
  google_calendar: 'google-calendar',
}

export function toOAuthRouteSlug(provider: string): string {
  return PROVIDER_TO_OAUTH_SLUG[provider] ?? provider
}
