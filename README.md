# NextJS Starter Template

해당 템플릿은 NextJS 프레임워크 기반으로 소규모 트래픽을 상정한 사이드 프로젝트 및 Saas 제작을 가장 빠른 시간에 제작하기 위해 한 오픈 소스 템플릿을 클로닝하는 프로젝트입니다.
클로닝으로 시작되었지만 필요하지 않다고 생각한 부분은 도입하지 않은 부분이 있고 만약 NextJS 및 라이브러리 등의 업데이트가 있을 경우 많은 부분이 수정될 수 있습니다.

[원본 repo](https://github.com/webdevcody/wdc-saas-starter-kit)
[Original Video walkthrough](https://webdevcody.gumroad.com/l/wdc-saas-starter-kit-walkthrough)

## 기능 명세

- 이메일 회원가입 / 로그인 및 자체 세션 핸들링
- Group Management(작업 중지)
- Drizzle ORM
- Light / Dark Mode
- Tailwind CSS
- Posthog Analytics

- Authorization
- Subscription Management (Stripe)
- Stripe Integration / Webhooks
- Group Management
- File Upload to R2
- Drizzle ORM
- Light / Dark Mode
- ShadCN
- Tailwind CSS
- Posthog Analytics

## 사용하는 법(작업중)

깃헙 리포에서 "use this template"버튼을 누르고 새 리포에 복사해서 클로닝하여 사용합니다. .env, .env.production은 직접 추가하시면 됩니다.

### 요구사항

Docker와 Docker Compose를 통해 postgres db를 빌드합니다. 다른 방법으로 사용하신다면 수정이 필요합니다.

## How to Run

1. cp .env.sample .dnv
2. pnpm i
3. docker compose up
4. pnpm run db:migrate
5. pnpm run dev

## Env Setup

해당 템플릿을 구동하기 위해 env.ts 안의 env 변수 명을 지정해야 합니다.

## Database

postgres db를 사용하고 있습니다.
