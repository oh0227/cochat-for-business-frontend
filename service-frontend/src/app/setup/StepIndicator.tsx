'use client'

const STEPS = ['소개', '메신저 연동', '캘린더 연동'] as const

interface StepIndicatorProps {
  currentStep: 0 | 1 | 2
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((label, index) => {
        const isDone = index < currentStep
        const isActive = index === currentStep
        return (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-[var(--spacing-3xs)]">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full font-semibold"
                style={{
                  fontSize: 'var(--font-size-5xs)',
                  background: isDone || isActive ? 'var(--color-brand-500)' : 'var(--color-gray-50)',
                  color: isDone || isActive ? 'white' : 'var(--color-gray-400)',
                }}
              >
                {index + 1}
              </span>
              <span
                className="hidden font-medium sm:inline"
                style={{
                  fontSize: 'var(--font-size-3xs)',
                  color: isActive ? 'var(--color-gray-950)' : 'var(--color-gray-400)',
                }}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <span
                className="h-px w-6 shrink-0 sm:w-10"
                style={{ background: isDone ? 'var(--color-brand-500)' : 'var(--color-gray-80)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
