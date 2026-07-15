# Commit Convention

## 형식

```
<type>: <description>

<optional body>

<optional footer>
```

### type

| type | 의미 |
|------|------|
| feat | 새 기능 |
| fix | 버그 수정 |
| refactor | 동작 변화 없는 코드 구조 개선 |
| docs | 문서 변경 |
| test | 테스트 추가/수정 |
| chore | 빌드, 설정, 의존성 등 잡무 |
| perf | 성능 개선 |
| ci | CI/CD 설정 변경 |

### description

- 한글 사용 가능, 명령형/현재형으로 간결하게 (예: "브리핑 상세 페이지 백엔드 연동")
- 끝에 마침표 붙이지 않음

### footer (이슈 참조)

[[github-issue-workflow]] 규칙에 따라 모든 작업은 이슈 번호와 연결되므로, 커밋 footer에 이슈 참조를 남긴다.

- 이슈를 완전히 해결하는 커밋: `closes #번호`
- 이슈와 관련은 있지만 아직 완전히 해결되지 않은 커밋: `refs #번호`

단, `closes #번호`는 GitHub 자동 종료 트리거일 뿐이며, 실제 이슈 종료는 배포 서버에서 사용자가 확인한 뒤 수동으로 처리한다 (github-issue-workflow.md 참고). 즉 `closes`를 커밋에 적더라도 PR이 머지되기 전까지는 이슈가 자동으로 닫히지 않으며, merge 이후에도 사용자 확인 전에는 닫힌 이슈를 다시 열어두지 않도록 주의한다.

## 예시

```
feat: 브리핑 상세 페이지 백엔드 연동

refs #12
```

```
fix: SSE 재연결 시 중복 알림 발생 수정

- 재연결 시 이전 EventSource를 정리하지 않던 문제 수정

closes #18
```
