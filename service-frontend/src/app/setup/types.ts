export type Provider = 'slack' | 'discord' | 'jira' | 'google_calendar'

/** provider별 연동 계정 개수. 백엔드가 연동 계정마다 별도 레코드를 내려주므로 개수를 센다. */
export type ConnectionCounts = Partial<Record<Provider, number>>
