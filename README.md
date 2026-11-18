# work-for-auraworks

Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Drizzle ORM, Inversify 기반의 교재 스토어 과제입니다.

## 실행

Node.js 24 LTS, pnpm 11.10.0, Docker Desktop을 사용합니다.

```powershell
pnpm.cmd install --frozen-lockfile
Copy-Item .env.example .env.local  # 기존 파일이 없다면 실행
pnpm.cmd supabase:start
pnpm.cmd db:migrate
pnpm.cmd db:seed
pnpm.cmd dev
```

Windows 실행 정책으로 `pnpm.ps1`이 차단되면 `pnpm.cmd`를 사용합니다. macOS/Linux에서는 `pnpm`을 사용하세요. 기본 포트가 사용 중이면 Next.js가 출력하는 주소로 접속합니다.

- 스토어: http://localhost:3000/store (`/`는 `/store`로 이동)
- Supabase Studio: http://127.0.0.1:55323
- Supabase API: http://127.0.0.1:55321
- PostgreSQL: `127.0.0.1:55322`
- 헬스 체크: `/api/health` (DB 상태를 검사하지 않음)

로컬 Supabase 프로젝트 ID는 `work-for-auraworks`입니다. 다른 프로젝트와 충돌하지 않도록 553xx 포트를 사용합니다. `pnpm supabase:status`로 확인하고 `pnpm supabase:stop`으로 중지합니다. 기본 중지는 Docker 볼륨의 데이터를 유지합니다. Windows Docker 로그 수집 의존성을 피하도록 Analytics는 비활성화했습니다.

## 화면과 컴포넌트

피그마의 헤더·배너·검색·필터·4열 목록·페이지네이션·푸터 구성을 따릅니다. 폰트와 상세 크기는 실제 스토어의 DOM/CSS 측정값을 적용했습니다. 모바일 2열, 태블릿 3열, 데스크톱 4열이며 작은 화면의 메뉴는 shadcn Sheet로 제공합니다.

`SiteHeader`, `SiteFooter`는 공용 레이아웃이고 `features/books/components`에는 `StoreBanner`, `StoreToolbar`, `BookCard`, `BookGrid`, `StorePagination`, 이들을 연결하는 `StoreCatalog`가 있습니다. shadcn의 Button, Input, Pagination, Skeleton, Alert, Sheet, Sonner를 사용합니다.

검색은 300ms 지연 후 API를 호출합니다. 검색·유형·페이지는 URL과 Query Key에 반영되고 검색·필터 변경 시 첫 페이지로 이동합니다. 로딩, 오류·재시도, 빈 결과 상태를 제공합니다. 인증·상세·결제·장바구니와 회사 메뉴는 준비 중 안내만 표시합니다.

검색 입력과 URL 동기화, 유형 변경, 페이지 이동은 `src/app/store/customHook/use-book-filters.ts`의 `useBookFilters`에서 관리합니다. `StoreCatalog`는 이 훅과 TanStack Query를 연결하고 조회 상태에 따라 목록과 안내 UI를 렌더링합니다. 페이지 이동 시 목록 상단으로 부드럽게 스크롤합니다.

### 프로젝트 구조와 import 규칙

```text
src/
  app/                 # 페이지, API Route Handler, 스토어 필터 훅
  components/          # 공용 레이아웃과 shadcn/ui 컴포넌트
  features/books/      # 교재 타입, API 호출 함수, 화면 컴포넌트
  providers/           # TanStack Query Provider
  server/              # Controller, Service, Repository, DB, DI, 오류 처리
  lib/                 # 공용 유틸리티
scripts/               # DB 연결 확인, 시드, API 통합 테스트
```

같은 폴더의 파일은 `./파일명`, 다른 폴더의 `src` 파일은 `@/...`로 import합니다. `@/*`는 `tsconfig.json`에서 `./src/*`에 연결한 별칭이며, DB 스크립트에도 같은 규칙을 적용합니다. `src` 밖의 데이터 파일과 로컬 폰트 등은 상대 경로를 유지합니다.

```typescript
import { BookGrid } from "./book-grid";
import { Button } from "@/components/ui/button";
```

## 계층 구조와 데이터 흐름

```text
브라우저의 TanStack Query
  → GET /api/books (Next.js Route Handler)
  → BookController (입력 검증·응답)
  → BookService (가격 표현·페이지 정책)
  → BookRepository 인터페이스
  → DrizzleBookRepository (조회·검색·페이지네이션)
  → Drizzle → Supabase PostgreSQL
```

Spring MVC의 View 역할은 React가 담당합니다. 서버 클래스는 `src/server`의 controllers/services/repositories에 분리하고 `di`의 Inversify 컨테이너가 생성자 주입으로 연결합니다. 팩토리 바인딩을 사용하므로 데코레이터 설정에 의존하지 않습니다. 사용자별 상태는 싱글턴 클래스에 보관하지 않습니다.

클라이언트는 API만 호출하며 DB 드라이버와 `DATABASE_URL`은 서버에서만 사용합니다. 서버 진입점은 `server-only`로 보호하고 Node.js 런타임에서 실행합니다. DB 연결은 지연 생성하고 개발 중 재사용합니다. 공유 타입은 서버 의존성이 없는 `features/books/types.ts`에 있습니다.

### 조회 API

```text
GET /api/books?q=시즌4&type=pass&page=1&pageSize=12
```

- `q`: 상품명 검색, 최대 100자. SQL 와일드카드는 일반 문자로 처리합니다.
- `type`: `all`(기본), `pass`, `single`.
- `page`: 1 이상의 정수, 기본 1, 상한 1,000,000.
- `pageSize`: 페이지당 개수, 1 이상 100 이하의 정수, 기본 12.
- 정렬 순서와 ID 기준으로 안정적으로 정렬합니다.
- 응답: `{ items, total, page, pageSize, totalPages }`.
- 교재: `{ id, name, type, imagePath, originalPrice, salePrice, discountRate }`.
- 범위를 넘는 페이지는 빈 목록, 잘못된 입력은 400, 서버 오류는 내부 정보가 없는 500 응답을 반환합니다.
- 오류 응답: `{ error: { message } }`. 성공 응답은 `Cache-Control: no-store`를 사용합니다.

`BookService`는 전달받은 `pageSize`로 목록을 조회하고 `Math.ceil(total / pageSize)`로 전체 페이지 수를 계산합니다. `fetchBooks`도 선택적인 `pageSize`를 API에 전달할 수 있습니다. 현재 스토어 화면은 크기 선택 UI 없이 기본값 12를 사용하며, `/store` URL의 필터는 `q`, `type`, `page`입니다.

예를 들어 시드 데이터 기준으로 `/api/books?page=2&pageSize=5`를 요청하면 교재 5개와 `total: 28`, `page: 2`, `pageSize: 5`, `totalPages: 6`을 반환합니다.

Repository는 전체 개수와 페이지 목록을 두 쿼리로 조회합니다. `repeatable read` 격리 수준의 읽기 전용 트랜잭션에서 실행하므로 두 조회는 같은 스냅샷을 기준으로 합니다. 범위를 벗어난 페이지에서도 목록은 비어 있지만 전체 개수는 유지됩니다. 상품명 검색에는 대소문자를 구분하지 않는 `ILIKE`를 사용합니다.

## DB와 더미 데이터

애플리케이션 스키마는 `src/server/db/schema.ts`, 변경 이력은 `drizzle/`에서 관리합니다. 스키마와 마이그레이션을 함께 커밋하고 Supabase SQL Editor로 같은 테이블을 중복 관리하지 않습니다. Supabase 내부 테이블은 수정하지 않습니다.

```sh
pnpm db:generate  # 스키마 변경 후 마이그레이션 생성
pnpm db:migrate   # DATABASE_URL 대상에 적용
pnpm db:seed      # 교재 28개를 고정 ID로 upsert, 반복 실행 가능
pnpm db:check     # Drizzle SELECT 1 연결 검사
pnpm db:studio
```

가격은 원 단위 정수이며 판매가가 정가를 초과하거나 음수가 되지 않도록 DB 제약을 적용했습니다. 더미 데이터는 2026-11-18 확인한 실제 스토어의 교재 14개와 이를 복제한 추가 더미 14개로 총 28개이며, 기본 12개씩 3페이지로 표시합니다. 추가 더미는 기존 이미지를 재사용합니다. 실제 운영 사이트의 DB/API와 연결하지 않습니다.

추가 더미는 이름에 `(추가 더미)`를 붙이고 원본의 유형과 가격을 유지합니다. 전체 구성은 패스 10개, 단과 18개입니다. 고정 ID로 upsert하므로 시드를 다시 실행해도 같은 데이터가 중복 생성되지 않으며, 시드 대상 외의 데이터는 삭제하지 않습니다.

`DATABASE_URL`은 Git에서 제외된 `.env.local`에 둡니다. Drizzle Kit과 스크립트도 Next.js 환경변수 로딩 규칙을 사용합니다. `NEXT_PUBLIC_` 접두어를 붙이지 않습니다.

## 에셋 출처

- 레이아웃: https://www.figma.com/design/vxUgfNXdsXsTMxqKsgQufI/?node-id=1-186
- 교재 이미지·로고·세부 수치: https://hiddenkice.co.kr/store
- 배너: 사용자가 제공한 1440 × 490px PNG. 문구·버튼·`1/5` 표시는 원본에 포함되어 있습니다. 배너는 한 장이며 실제 슬라이드 기능은 없습니다.
- 교재 이미지 14개와 로고는 `public/images`에 저장했습니다. 원본 URL·상품 정보는 `scripts/data/source-books.json`에 있습니다. 기간 제한이 있는 외부 URL에 런타임 의존하지 않습니다.
- Pretendard Variable은 공식 저장소에서 받아 `public/fonts`에 저장했고 SIL Open Font License를 함께 포함했습니다: https://github.com/orioncactus/pretendard

## 검증

```sh
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm test:api
```

API 통합 테스트는 마이그레이션과 시드가 적용된 로컬 DB와 실행 중인 앱이 필요합니다. 총 28개의 시드 데이터를 기준으로 기본 3페이지의 개수와 중복 여부, 사용자 지정 `pageSize`, 할인 계산, 검색·유형 조합, 빈 결과, 잘못된 입력의 400 응답을 5개 테스트로 검증합니다. 기본 대상은 `http://localhost:3000`입니다. 다른 포트에서는 PowerShell에서 `$env:TEST_BASE_URL = 'http://localhost:3001'`을 설정합니다.

`pnpm format`은 Prettier와 Tailwind 클래스 정렬을 적용합니다. `pnpm start`는 프로덕션 빌드를 실행합니다.

## 배포

GitHub 업로드와 Vercel 배포는 후속 작업입니다. Vercel에서는 이 PC의 Docker DB에 접근할 수 없으므로 Supabase 클라우드 프로젝트의 서버용 `DATABASE_URL`을 설정해야 합니다. 서버리스에는 transaction pooler 연결 문자열을 사용하며 드라이버는 `prepare: false`로 구성했습니다. 마이그레이션은 대상에 맞는 direct/session 연결로 별도 실행하고 빌드 중 자동 적용하지 않습니다. 운영 데이터에 더미 시드를 자동 실행하지 않습니다.
