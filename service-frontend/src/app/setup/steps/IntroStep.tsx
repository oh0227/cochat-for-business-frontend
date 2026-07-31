'use client'

import Image from 'next/image'
import { Sparkles, CalendarCheck, ShieldCheck } from 'lucide-react'

const HIGHLIGHTS = [
  {
    Icon: Sparkles,
    title: 'AI가 중요도를 분류',
    description: '쏟아지는 메시지를 긴급/중요/보통/낮음으로 자동 분류해요.',
  },
  {
    Icon: CalendarCheck,
    title: '일정은 캘린더로',
    description: '메시지에 적힌 일정을 찾아 캘린더 등록까지 이어줘요.',
  },
  {
    Icon: ShieldCheck,
    title: '집중모드 지원',
    description: '집중이 필요할 땐 긴급 알림만 남기고 나머지는 조용히 쌓아요.',
  },
]

interface IntroStepProps {
  onNext: () => void
}

export default function IntroStep({ onNext }: IntroStepProps) {
  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-5 sm:gap-8">
      <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
        <Image src="/icon.png" alt="CoChat" width={72} height={72} />

        <div className="flex flex-col items-center gap-1 text-center">
          <h1
            className="font-bold text-[var(--color-gray-950)]"
            style={{ fontSize: 'var(--font-size-2xl)', lineHeight: 'var(--line-height-3xl)' }}
          >
            Cochat에 오신 것을 환영합니다.
          </h1>
          <p
            className="text-[var(--color-gray-700)]"
            style={{ fontSize: 'var(--font-size-xs)', lineHeight: 'var(--line-height-3xs)' }}
          >
            CoChat은 여러 워크스페이스의 알림을 한곳에 모아 메시지의 중요도를 분류해 전달하여,
            <br className="hidden sm:inline" />
            사용자가 온전히 집중할 수 있는 업무 환경을 만듭니다.
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-start gap-2 rounded-[14px] border border-[var(--color-gray-80)] p-4"
          >
            <span
              className="flex size-10 items-center justify-center rounded-[10px]"
              style={{ background: 'var(--color-brand-20)' }}
            >
              <Icon size={20} className="text-[var(--color-brand-500)]" />
            </span>
            <div className="flex flex-col gap-[2px]">
              <span
                className="font-semibold text-[var(--color-gray-950)]"
                style={{ fontSize: 'var(--font-size-3xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {title}
              </span>
              <p
                className="text-[var(--color-gray-700)]"
                style={{ fontSize: 'var(--font-size-4xs)', lineHeight: 'var(--line-height-4xs)' }}
              >
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex h-12 w-full items-center justify-center rounded-[12px] font-medium text-white transition-opacity hover:opacity-80 sm:w-[200px]"
        style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-brand-500)' }}
      >
        시작하기
      </button>
    </div>
  )
}
