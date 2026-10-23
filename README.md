# 인사총무팀 업무 보드

"직원은 완료만 누른다" — 반복 업무 자동 생성, 회의 메모 → 카드 변환, 완료 시 다음 담당자 자동 인계를 갖춘 팀 칸반. 기획은 [PRD.md](PRD.md).

서비스 주소: https://hr-kanban.vercel.app

## 실행
- 로컬: `index.html`을 브라우저로 열기 (데이터는 브라우저에 저장)
- 배포: Vercel에 저장소 연결 (빌드 설정 없음)

## AI 메모 변환 (선택)
Vercel 프로젝트 Settings → Environment Variables에 `ANTHROPIC_API_KEY`를 추가하면 `/api/parse`가 Claude로 업무를 추출합니다. 키가 없으면 브라우저의 규칙 기반 파서가 동작합니다.
