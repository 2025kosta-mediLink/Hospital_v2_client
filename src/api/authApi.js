import apiClient from "./client";

/**
 * 아이디 중복 확인
 * GET /api/auth/check-id?loginId=xxx
 */
export const checkLoginId = async (loginId) => {
  try {
    const response = await apiClient.get("/auth/check-id", {
      params: { loginId },
    });
    return response.data;
  } catch (error) {
    throw new Error("아이디 중복 확인 중 오류가 발생했습니다.");
  }
};

/**
 * 회원가입
 * POST /api/auth/sign-up
 */
export const signUp = async (userData) => {
  try {
    const response = await apiClient.post("/auth/sign-up", userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "입력 정보를 확인해주세요."
      );
    }
    throw new Error("회원가입 중 오류가 발생했습니다.");
  }
};

/**
 * 로그인
 * POST /api/auth/login
 */
export const login = async (loginId, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      loginId,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
    throw new Error("로그인 중 오류가 발생했습니다.");
  }
};

/**
 * 로그아웃
 * POST /api/auth/logout
 */
export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    throw new Error("로그아웃 중 오류가 발생했습니다.");
  }
};

/**
 * 내 정보 조회
 * GET /api/auth/me
 */
export const getMyInfo = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    throw new Error("사용자 정보를 가져오는데 실패했습니다.");
  }
};
