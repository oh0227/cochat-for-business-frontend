// [백엔드 연결] 이 파일은 실제 백엔드가 준비되기 전까지 사용하는 목업 OAuth 콜백 Route Handler입니다.
// 실제 OAuth 콜백은 백엔드가 처리합니다. 백엔드 연결 후 이 파일은 삭제하세요.
//
// ─── 실제 백엔드 연결 시 체크리스트 ───────────────────────────────────────
//
// 1. 이 파일(route.ts) 삭제
//
// 2. 실제 OAuth 콜백 처리는 백엔드에서 수행됩니다.
//    백엔드는 OAuth code를 받아 access_token을 발급받고,
//    프론트엔드의 /setup?provider={provider}&status=connected 로 리다이렉트합니다.
//
// 3. 에러 케이스 처리
//    - OAuth 실패 시: /setup?provider={provider}&status=error&message=... 으로 리다이렉트
//    - SetupClient.tsx에서 status=error 케이스에 대한 에러 UI 추가 필요
// ────────────────────────────────────────────────────────────────────────────

type RouteParams = Promise<{ provider: string }>

export async function GET(request: Request, { params }: { params: RouteParams }) {
  const { provider } = await params

  // [백엔드 연결] 아래 로직 삭제. 실제 콜백은 백엔드에서 처리됩니다.
  const baseUrl = new URL(request.url).origin
  return Response.redirect(`${baseUrl}/setup?provider=${provider}&status=connected`)
}
