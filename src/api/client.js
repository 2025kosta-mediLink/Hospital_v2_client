import axios from "axios";

// API 클라이언트 기본 설정
const apiClient = axios.create({
  baseURL: "/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 세션 쿠키 전송을 위해 필요
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가 등
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    console.error("Response Error:", error);

    // 인증 에러 처리 (401)
    if (error.response?.status === 401) {
      // 필요시 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
