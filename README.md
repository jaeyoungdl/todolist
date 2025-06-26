# Todo Backend API

NestJS와 PostgreSQL을 사용한 Todo 관리 백엔드 API 서버입니다.

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env` 파일에 PostgreSQL 데이터베이스 연결 정보를 설정하세요.

3. 서버 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 사용자
- `GET /api/users` - 사용자 목록 조회
- `GET /api/users/profile` - 내 프로필 조회
- `GET /api/users/:id` - 특정 사용자 조회

### 할 일
- `GET /api/todos` - 내 할 일 목록 조회
- `POST /api/todos` - 새 할 일 생성
- `GET /api/todos/:id` - 특정 할 일 조회
- `PATCH /api/todos/:id` - 할 일 수정
- `PATCH /api/todos/:id/status` - 할 일 상태 변경
- `DELETE /api/todos/:id` - 할 일 삭제

## 데이터베이스 스키마

### users 테이블
- id: UUID (Primary Key)
- email: string (Unique)
- name: string
- password: string (Hashed)
- isActive: boolean
- createdAt: timestamp
- updatedAt: timestamp

### todos 테이블
- id: UUID (Primary Key)
- title: string
- description: string (nullable)
- status: enum ('todo', 'inProgress', 'completed')
- startDate: date (nullable)
- endDate: date (nullable)
- authorId: UUID (Foreign Key to users)
- assignedToId: UUID (Foreign Key to users, nullable)
- createdAt: timestamp
- updatedAt: timestamp 