# 🏥 MediLink  
### 병원 예약·접수·처방전 통합 웹앱 서비스  
> 환자의 병원 방문 과정을 온라인에서 한 번에 처리할 수 있는 통합 의료 웹앱

---

## 📑 목차
1. 프로젝트 개요  
2. 주요 기능  
3. 협업 방식  
4. 개발 문서  
5. 시연 영상  

---

## 1. 프로젝트 개요

### 🔎 설명
**MediLink**는 병원 방문 과정(예약 → 접수 → 대기 → 진료 → 처방 → 수령)을  
모바일 웹 환경에서 **원스톱으로 처리할 수 있도록 만든 통합 병원 서비스**입니다.

기존 병원 이용의 복잡함을 해소하고,  
환자가 쉽고 빠르게 의료 서비스에 접근할 수 있도록  
예약·접수·처방전·약국 연동까지 하나의 흐름으로 제공합니다.

### 📆 개발 기간
- **2025. 11. 14 ~ 2025. 11. 25**

### 🏗️ 구성
- **Frontend**: React 19, Vite, React Query, React Router, TailwindCSS, Kakao Map SDK, Axios  
- **Backend**: Spring Boot 3.5, JPA, Hibernate, MySQL 8.0, Redis (세션 저장소)  
- **Infra**: Docker, Docker Compose, GitHub Actions (CI/CD)  
- **Collaboration**: Figma, Notion, Discord  

### 🛠️ 핵심 기술
- **모바일 퍼스트 UX**: iPhone 프레임 기준 반응형 구성  
- **JPA 기반 REST API**: 병원 예약·접수·처방 프로세스 엔드투엔드 구축  
- **Redis 세션 관리**: 로그인 상태 및 대기 알림 유지  
- **카카오 지도 / 공유 API**: 병원 위치, 약국 찾기 및 공유 기능 구현  
- **PDF Export**: 처방전 PDF 변환 및 다운로드  
- **Docker Compose + GitHub Actions**: 배포 자동화 파이프라인 구축  

### 📱 화면 대표 이미지
<img width="382" height="814" alt="캡처_2025_11_24_16_30_58_219" src="https://github.com/user-attachments/assets/addd1930-2266-4cb1-b647-b9696a8fe2de" />
<img width="382" height="814" alt="캡처_2025_11_24_16_31_03_158" src="https://github.com/user-attachments/assets/cbf5de5c-ff2c-48f5-93e4-52feb4898396" />

---

## 2. 주요 기능

### 🔐 회원
- 회원가입, 로그인, 비밀번호 인증  
- 내 정보 조회 및 관리  

### 🗂️ 예약
- 진료과·의료진 선택  
- 예약 가능 시간 조회  
- 예약 생성 / 조회 / 취소  
- 카카오톡 공유하기  

### 📝 접수
- 증상 및 전달사항 입력  
- 주의사항 동의 후 접수 확정  
- 접수 생성 / 조회 / 취소  
- 실시간 대기 현황 및 알림 제공  

### 💊 처방전 / 약국
- 처방전 조회 및 PDF 다운로드  
- 주변 약국 지도 검색  
- 처방전 전송 및 본인 인증 수령  

---

## 3. 협업 방식
- **Git Flow 전략** (main / develop / feature-*)  
- **코드리뷰 & Pull Request** 기반 협업  
- **Notion**으로 요구사항 및 문서 관리  
- **Figma**로 UI·프로토타입 공동 설계  
- **Discord**로 실시간 소통  
- **GitHub Actions**를 통한 CI/CD 자동화  

---

## 4. 개발 문서

### 📘 화면 설계서
<details>
<summary>화면설계서 보기</summary>
<br/>
<img width="4534" height="11461" alt="병원 프로젝트 - 최종" src="https://github.com/user-attachments/assets/e734ce3a-54bc-4307-ba11-d9e3f788a2e8" />
</details>

### 📙 요구사항 정의서
[요구사항 정의서 바로가기](https://sugared-visitor-f84.notion.site/277b450e6b2381d8a8e8d2b11c755eb7?source=copy_link)

### 📗 ERD 설계서
[ERD 설계서 바로가기](https://www.erdcloud.com/d/chHaif24EmAFcaMNW)

### 📕 시스템 아키텍처
<details>
<summary>시스템 아키텍처 보기</summary>
<br/>
<img width="841" height="562" alt="시스템 아키텍처" src="https://github.com/user-attachments/assets/aadf7ab3-7fbc-4754-ae48-c13f08e1660e" />
</details>

### 📒 API 명세서
[API 명세서 바로가기](https://sugared-visitor-f84.notion.site/API-1-277b450e6b2381cb8fffdfb676b3af53?source=copy_link)

---

## 5. 🎥 시연 영상
🎬 **시연 영상 준비 중입니다.**  
(배포 버전 업로드 후 YouTube 링크 추가 예정)

---
