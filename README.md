# 쇼핑몰 애플리케이션

이 프로젝트는 쇼핑몰 웹사이트를 구축하기 위한 웹 애플리케이션입니다. 다양한 UI 컴포넌트와 페이지, 비즈니스 로직을 포함하고 있습니다.

## 프로젝트 구조

```
shopping-mall-app
├── app
│   └── api
│       ├── auth
│       ├── cart
│       ├── category
│       ├── orders
│       ├── products
│       ├── review
│       ├── user
│       ├── login
│       └── signup
├── lib                # 공통 함수 및 유틸리티
├── prisma             # Prisma 스키마 및 마이그레이션
├── public             # 정적 파일
├── .env               # 환경 변수 파일
├── .gitignore         # Git 무시 파일
├── package.json       # npm 설정 파일
├── package-lock.json  # npm lock 파일
├── tsconfig.json      # TypeScript 설정 파일
└── README.md          # 프로젝트 문서
```
## 기술 스택

- Next.js
- React
- TypeScript
- Prisma ORM
- MySQL
- TailwindCSS

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 참고)
# 예시: DATABASE_URL, JWT_SECRET 등

# 개발 서버 실행
npm run dev
```

## 주요 기능

- 회원가입 및 로그인 (JWT 인증)
- 상품 등록/조회/수정/삭제 (관리자)
- 카테고리 관리
- 장바구니 및 주문 기능
- 상품 리뷰 작성 및 조회

## 문의

- 문의: jaehyun516@naver.com
