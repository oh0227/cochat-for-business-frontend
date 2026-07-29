// 알림을 구글 캘린더 일정으로 등록하는 프록시.
// 백엔드: POST /api/v1/notifications/{notification_id}/calendar-event
// Body(둘 다 optional): { start_time?: string, duration_minutes?: number }

import { NextRequest, NextResponse } from 'next/server'
import { TEMP_USER_ID } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))

  const res = await fetch(`${BASE_URL}/api/v1/notifications/${id}/calendar-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Cochat-User-Id': String(TEMP_USER_ID),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '캘린더 등록에 실패했습니다.')
    return NextResponse.json({ error: text }, { status: res.status })
  }

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
