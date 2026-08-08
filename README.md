<div align="center">
  
# CoChat
<img width="1983" height="793" alt="cochat banner" src="https://github.com/user-attachments/assets/5327ca40-9953-4506-8812-c89679a1d2ae" />


</div>

<p align="center">
  여러 업무 채널의 알림을 한 곳으로 모으고, AI가 중요도를 분류·요약해 딥워크 시간을 지켜주는 업무 알림 통합 서비스
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Zustand-5-443E38?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Demo-yellow?style=flat-square" />
</p>

<p align="center">
  <a href="https://cochat-for-business.vercel.app">🔗 라이브 데모</a>
</p>

---

## 소개

CoChat은 Slack·Discord 같은 여러 업무 채널에 흩어진 메시지를 한 화면에서 확인하고, AI가 긴급도를 분류해주는 알림 통합 서비스다.

### 문제

<img width="2730" height="1536" alt="CoChat_문제인식_완성" src="https://github.com/user-attachments/assets/2f660549-e293-4e83-8912-ae5a5bb1f518" />


여러 메신저를 동시에 쓰는 팀에서는 "지금 당장 봐야 하는 메시지"와 "나중에 봐도 되는 메시지"가 뒤섞여서, 결국 알림을 계속 확인하느라 몰입해서 일하는 시간이 끊긴다.

### CoChat의 해결 방식

<img width="2752" height="1536" alt="CoChat_문제해결_완성" src="https://github.com/user-attachments/assets/c695239f-5224-4ef5-898b-4e2b8bbc05e1" />


CoChat은 메시지 수신 시점에 AI가 긴급도·일정 관련 여부를 판단해서, 집중 모드 중에는 정말 긴급한 것만 보여주고 나머지는 보류시켰다가 브리핑으로 한 번에 정리해서 보여준다. 일정이 언급된 메시지는 감지해서 Google Calendar 등록까지 이어준다.

## 핵심 기능

### 대시보드 — 알림 현황 한눈에 보기

긴급/중요/보통 알림 건수, 진행 중인 집중 모드 세션, 최근 메시지·브리핑을 한 화면에서 확인한다.

<img width="1584" height="993" alt="대시보드" src="https://github.com/user-attachments/assets/ef8c0a8d-57cf-4008-8615-7960604ee712" />


### 메시지 — 통합 알림 목록

Slack·Discord에서 온 메시지를 실시간(SSE)으로 수신해 우선순위 배지와 함께 보여준다. 일정 관련 메시지는 자동으로 감지되어 캘린더 등록 버튼이 붙는다.

> 🖼️ **[스크린샷: 메시지 목록 + 채팅방(일정 등록 버튼, AI 답장 제안 포함)]**

### 집중 모드 — 딥워크 세션

시간을 정해두고 집중 모드를 시작하면, 그 사이 온 알림 중 긴급한 것만 실시간으로 알려준다. 나머지는 조용히 쌓아뒀다가 세션 중 "브리핑 받기"로 AI 요약을 확인할 수 있다. 화면을 껐다 켜거나 새로고침해도, 로컬 상태가 없으면 서버에 진행 중인 세션이 있는지 조회해서 정확한 경과 시간으로 복원한다.

> 🖼️ **[스크린샷: 집중 모드 진행 화면 — 타이머 + 확인 필요한 알림 + 보류 알림 배너]**

### 브리핑 — AI 요약

집중 모드 중 놓친 알림들을 AI가 하나의 브리핑으로 요약해준다. 긴급도별로 분류된 배지와 함께 전체 브리핑 히스토리를 확인할 수 있다.

> 🖼️ **[스크린샷: 브리핑 목록 + 브리핑 상세 화면]**

### 캘린더 — Google Calendar 연동

일정 관련 메시지는 감지 즉시(긴급) 또는 조용히 누적(비긴급)되고, 알림 카드의 등록 버튼으로 실제 Google Calendar에 일정을 만들 수 있다. `/calendar` 페이지는 별도 DB 없이 연동된 Google Calendar를 그대로 CRUD 프록시해서, 생성·수정·삭제가 실제 캘린더에 바로 반영된다.

> 🖼️ **[스크린샷: 캘린더 월간 뷰 + 일정 생성/상세 모달]**

## 기술 스택

브라우저는 Next.js 프론트를 통해서만 백엔드와 통신한다. 대부분의 요청은 Next.js Route Handler(`/api/**`)가 서버 사이드에서 FastAPI 백엔드로 프록시하고, 실시간 알림 스트림(SSE)처럼 브라우저가 직접 백엔드를 호출해야 하는 소수의 경로만 예외로 열어뒀다. 백엔드는 Slack/Discord/Google Calendar API와 통신하고, Groq LLM으로 메시지의 긴급도·일정 관련 여부를 판단해 저장한다.

- **프론트엔드** (Next.js 16 App Router + TypeScript): Zustand로 집중 모드 세션 등 전역 클라이언트 상태 관리, `@microsoft/fetch-event-source`로 인증 헤더를 실은 SSE 수신, Tailwind CSS 4 + CSS 커스텀 프로퍼티 기반 라이트/다크 테마
- **백엔드** (FastAPI, Render): 알림 수집·분류, 브리핑 생성, 집중 세션·캘린더 이벤트 관리 — [cochat-for-business-backend](https://github.com/oh0227/cochat-for-business-backend)
- **AI**: Groq LLM으로 메시지 긴급도 분류, 일정 관련 여부 판단
- **외부 연동**: Slack, Discord (메시지 수집), Google Calendar (OAuth, 일정 CRUD)

## 엔지니어링 하이라이트

- **SSE 인증 헤더**: 네이티브 `EventSource`는 커스텀 헤더를 못 붙인다는 제약이 있어, `@microsoft/fetch-event-source`로 교체해 인증 헤더를 실어 보내도록 했다.
- **로컬 상태 + 서버 복원 이중화**: 집중 모드 진행 상태를 localStorage(zustand persist)에 캐싱하되, 다른 브라우저·시크릿 모드처럼 로컬 상태가 없는 경우를 대비해 서버의 활성 세션 조회 API로 복원하는 경로를 따로 뒀다. 화면 재진입/탭 포그라운드 복귀 시에는 벽시계 시각 기준으로 경과 시간을 재계산해 `setInterval` 드리프트를 보정한다.
- **집중 모드 중 알림 필터링**: 집중 모드 중에는 긴급 알림만 실시간으로 방해하고, 나머지는 조용히 쌓아뒀다가 브리핑으로 한 번에 확인하도록 SSE 수신 로직에 우선순위 게이팅을 넣었다.
- **테마 토큰 시스템**: 라이트/다크 색상을 하드코딩하지 않고 CSS 커스텀 프로퍼티로 정의해서, 카드 배경처럼 투명도가 필요한 색은 알파 블렌딩으로 두 테마에 자동 적응하게 만들었다.
- **프론트/백엔드 비동기 협업**: 백엔드를 별도 세션에서 병행 개발하면서, API 스펙 불일치나 버그를 발견하면 재현 조건과 원인 분석을 문서로 정리해 전달하고, 반대로 백엔드가 배포한 변경사항을 프롬프트로 전달받아 연동하는 방식으로 작업했다.

## 폴더 구조

```
service-frontend/
├── src/
│   ├── app/
│   │   ├── (main)/          # 공통 GNB 레이아웃 (대시보드/메시지/브리핑/집중모드/캘린더/설정)
│   │   ├── api/              # Next.js Route Handler — 백엔드 프록시
│   │   └── setup/            # 최초 연동 온보딩
│   ├── components/
│   │   ├── ui/                # 페이지별 UI 컴포넌트
│   │   └── layout/            # 전역 레이아웃(사이드바, SSE 리스너, 집중모드 타이머 등)
│   ├── store/                 # Zustand 전역 상태 (집중 모드, 캘린더 팝업 큐)
│   ├── lib/                   # 백엔드 API 클라이언트, 클라이언트-사이드 fetch 헬퍼
│   ├── types/                  # 도메인별 TypeScript 타입
│   ├── hooks/                  # 커스텀 훅
│   └── utils/                  # 포맷팅 등 유틸리티
└── public/
```

## 시작하기

```bash
git clone https://github.com/oh0227/cochat-for-business-frontend.git
cd cochat-for-business-frontend/service-frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_BACKEND_URL 등 설정 후

npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있다.

## 현재 상태 및 로드맵

**백엔드**: FastAPI를 Render에서 상시 구동 중이며, 이 프론트는 Vercel에 배포되어 실제 백엔드와 연동된 상태로 동작한다.

**프론트엔드**: 팀 해커톤 프로젝트로 시작해 이후 혼자 이어서 개발 중인 데모/포트폴리오 단계 프로젝트다. 알려진 제약과 다음 단계를 남겨둔다.

- 실제 로그인/인증 시스템이 없다. 지금은 고정된 테스트 유저(`TEMP_USER_ID`)로 동작한다.
- 자동화된 테스트가 없다. 회귀를 직접 브라우저로 확인하며 개발했다.
- 메시지에서 일정 시간을 자동으로 추출하는 기능은 백엔드 작업 대기 중이라, 현재는 등록 시 시간을 직접 확인/입력해야 한다.
- Jira, Gmail은 알림 provider 타입상으로는 준비돼 있지만 실제 OAuth 연동은 아직 Slack·Discord·Google Calendar만 구현되어 있다.

## 커밋 히스토리

총 120개 이상의 커밋. 모든 작업은 GitHub 이슈를 먼저 등록한 뒤 `dev` 브랜치에서 진행하고, 로컬 브라우저에서 실제 동작을 확인한 뒤에만 이슈를 닫는 방식으로 개발했다.

## 라이선스

0BSD
