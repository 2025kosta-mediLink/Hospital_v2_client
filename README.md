# 🏥 MediLink – 병원 예약·접수·처방전 통합 웹앱 서비스

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
- **2025. 11. 17 ~ 2025. 11. 25**

### 🏗️ 구성
- **Frontend**: React, Vite, TailwindCSS  
- **Backend**: Spring Boot, JPA, MySQL  
- **Infra**: AWS EC2, Nginx, Docker, GitHub Actions(CI/CD)  
- **Collaboration**: Figma, Notion, Discord  

### 🛠️ 핵심 기술
- 모바일 웹앱 기반 UI/UX 구성  
- 병원 예약/접수/처방전 도메인 설계 및 API 구축  
- 실시간 대기 상태 알림 기반 업데이트  
- 처방전 → 약국 연동  
- Session 기반 로그인 인증  
- 카카오 지도 / 공유하기 API 활용  
- PDF 변환·다운로드 처리  

### 📱 화면 이미지
(Figma 캡쳐 또는 대표 화면 이미지 삽입)

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
 
- Git Flow 전략 사용 (main / develop / feature-*)  
- 코드리뷰 & Pull Request 기반 협업  
- Notion으로 요구사항·문서 관리  
- Figma로 UI/프로토타입 공동 작업
- Discord를 통한 실시간 양방향 소통  
- GitHub Actions 기반 CI/CD 자동화  

---

## 4. 개발 문서

### 📘 화면 설계서
<details> <summary>화면설계서 보기</summary> <br/> <img width="4534" height="11461" alt="병원 프로젝트 - 최종" src="https://github.com/user-attachments/assets/e734ce3a-54bc-4307-ba11-d9e3f788a2e8" /> </details>

### 📙 요구사항 정의서  
[(요구사항 정의서 링크)](https://sugared-visitor-f84.notion.site/277b450e6b2381d8a8e8d2b11c755eb7?source=copy_link)

### 📗 ERD 설계서
[(ERD 설계서 링크)](https://www.erdcloud.com/d/chHaif24EmAFcaMNW)

### 📕 시스템 아키텍처  
(API 서버, DB, Infra 구성도 이미지 첨부)

### 📒 API 명세서
[(API 명세서 링크)](https://sugared-visitor-f84.notion.site/API-1-277b450e6b2381cb8fffdfb676b3af53?source=copy_link)

---

## 5. 🎥 시연 영상
(YouTube 링크 또는 영상 파일 링크)

---
