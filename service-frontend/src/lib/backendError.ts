/** 백엔드 에러 응답({ detail: string } 형태)에서 사람이 읽을 메시지를 뽑아낸다. */
export async function readBackendErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json() as { detail?: string }
    return data.detail ?? fallback
  } catch {
    return fallback
  }
}
