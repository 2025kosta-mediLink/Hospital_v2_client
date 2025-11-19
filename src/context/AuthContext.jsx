import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getMyInfo,
} from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 세션 확인 함수
  const checkAuth = useCallback(async () => {
    try {
      const response = await getMyInfo();
      setUser(response.data || response);
    } catch (error) {
      // 401은 정상 동작이므로 에러 로깅 안 함
      if (error.response?.status !== 401) {
        console.error("checkAuth error:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 앱 시작 시 세션 체크
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 로그인 함수
  const login = useCallback(
    async (loginId, password) => {
      const response = await apiLogin(loginId, password);
      // 로그인 성공 후 사용자 정보 다시 가져오기
      await checkAuth();
      return response;
    },
    [checkAuth]
  );

  // 로그아웃 함수
  const logout = useCallback(async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch {
      console.error("Logout failed");
      // 에러가 나도 로컬 상태는 초기화
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
