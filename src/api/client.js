import axios from "axios";

// API 클라이언트 기본 설정
const apiClient = axios.create({
  baseURL: "/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("[API 요청 에러]", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 상세 로깅
    console.error("[API 응답 에러]", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    // 인증 에러 처리 (401)
    if (error.response?.status === 401) {
      console.warn("[인증 실패] 로그인이 필요하거나 세션이 만료되었습니다.");
    }

    // 서버 에러 처리 (500~)
    if (error.response?.status >= 500) {
      console.error("[서버 에러] 서버에 문제가 발생했습니다.");
    }

    // 네트워크 에러 처리
    if (!error.response) {
      console.error("[네트워크 에러] 서버에 연결할 수 없습니다.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
