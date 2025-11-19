# Hospital v2 Client

## 환경 설정

### 1. 환경 변수 파일 생성

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

### 2. 카카오 JavaScript 키 발급

1. [카카오 개발자 센터](https://developers.kakao.com/) 접속
2. **내 애플리케이션** → 앱 선택 (또는 새로 생성)
3. **앱 키** → **JavaScript 키** 복사
4. `.env` 파일에 붙여넣기

```bash
# .env
VITE_KAKAO_JS_KEY=복사한_JavaScript_키
```

### 3. 개발 서버 실행

```bash
npm run dev
```

## 환경 변수 목록

| 변수명              | 설명                     | 필수 |
| ------------------- | ------------------------ | ---- |
| `VITE_KAKAO_JS_KEY` | 카카오 JavaScript SDK 키 | ✅   |

## 주의사항

- `.env` 파일은 **Git에 커밋하지 마세요** (민감 정보 포함)
- `.env.example` 파일은 **Git에 커밋하세요** (팀원 가이드용)
- 환경 변수 수정 후 **개발 서버 재시작** 필요
