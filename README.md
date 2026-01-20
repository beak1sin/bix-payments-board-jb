# 빅스 페이먼츠 프론트엔드 개발자 채용 과제

React + TypeScript + Vite 기반 게시판 CRUD 애플리케이션

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## ⚙️ 환경 변수 설정 (필수)

프로젝트 루트 경로에 `.env` 파일을 생성하고 아래 내용을 추가해주세요.

```env
VITE_API_BASE_URL=https://front-mission.bigs.or.kr
```

# 빌드된 결과물 미리보기
```
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── api/           # API 함수 (axios 인스턴스, auth, board)
├── components/    # 공통 컴포넌트
├── pages/         # 페이지 컴포넌트
├── stores/        # Zustand 상태 관리
├── types/         # TypeScript 타입 정의
└── App.tsx        # 라우터 설정
```

## 🛠 기술 스택

- **React 19** + **TypeScript**
- **Vite** - 빌드 도구
- **Zustand** - 상태 관리
- **React Router DOM v7** - 라우팅
- **Axios** - HTTP 클라이언트
- **Tailwind CSS v4** - 스타일링

## ✨ 주요 기능

- **회원가입** - 이메일, 이름, 비밀번호 유효성 검사
- **로그인** - JWT 토큰 기반 인증
- **게시글 CRUD** - 작성, 조회, 수정, 삭제
- **페이지네이션** - 게시글 목록 페이징
- **이미지 업로드** - 게시글에 이미지 첨부

## 🔐 인증 시스템

- JWT 토큰 기반 인증
- Access Token 만료 시 Refresh Token으로 자동 갱신
- localStorage에 토큰 저장
- Zustand로 인증 상태 전역 관리

## 📱 반응형 디자인

- 모바일/태블릿/데스크탑 대응
- Glassmorphism UI 스타일 적용
