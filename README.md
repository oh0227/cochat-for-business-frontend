# 🧊 CoChat - Frontend

> 여러 업무 채널의 알림을 한 페이지로 통합하고, AI가 중요도 분류와 한 줄 요약을 붙여 사용자의 딥워크 시간을 보호하는 서비스입니다.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + `clsx` & `tailwind-merge`
- **State Management:** Zustand
- **Icons:** `lucide-react`
- **Package Manager:** npm

## 📂 Folder Structure (도메인 기반)

```text
src/
├── app/ # 라우팅 및 페이지 (Next.js App Router)
│ ├── (main)/ # 공통 GNB 사이드바가 포함된 메인 레이아웃
│ │ ├── dashboard/ # 알림 현황 및 대시보드
│ │ ├── messages/ # 전체 수신 알림 리스트
│ │ ├── briefing/ # AI 딥워크 브리핑
│ │ ├── deepwork/ # 집중 모드 세션
│ │ └── calendar/ # 일정 관리
│ └── settings/
│ └── integrations/ # Slack, Jira 등 연동 설정
├── features/ # 도메인(기능)별 핵심 UI 컴포넌트
├── components/ # 공통/재사용 가능한 UI 컴포넌트 (Button, Badge 등)
├── hooks/ # 커스텀 훅 (SSE 수신, 타이머 등)
├── store/ # Zustand 전역 상태 보관소
├── services/ # API 통신 로직 및 Axios/Fetch 설정
├── types/ # TypeScript 공통 인터페이스 (NotificationEvent 등)
└── lib/ # 유틸리티 함수 (cn, date 등)
```

## 🚀 Getting Started

1. **환경 변수 세팅**
   루트 경로의 `.env.example`을 참고하여 `.env.local` 파일을 생성하고 로컬 환경에 맞는 값을 입력하세요.

2. **의존성 설치 및 실행**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

3. **브라우저 확인**
   [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인합니다.

## 🌿 Git Branch Strategy

- \`main\`: 운영계 배포용 (안정화된 버전)
- \`develop\`: 개발 테스트용 (기본 작업 브랜치)
- \`feature/\*\`: 개별 기능 개발용 브랜치 (ex: \`feature/dashboard\`)
