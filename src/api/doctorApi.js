import apiClient from "./client";

/**
 * 부서별 의사 목록 조회
 * GET /api/v2/doctor/list/department/:departmentId
 */
export const getDoctorsByDepartment = async (departmentId) => {
  try {
    const response = await apiClient.get(
      `/doctor/list/department/${departmentId}`
    );
    return response.data;
  } catch (error) {
    console.error("getDoctorsByDepartment error:", error);
    throw new Error("의사 목록을 가져오는데 실패했습니다.");
  }
};

/**
 * 의사별 공지사항 조회
 * GET /api/v2/doctor/:doctorId/notices
 * 백엔드에서 공지사항이 없으면 200 OK + 빈 배열 반환
 */
export const getDoctorNotices = async (doctorId) => {
  const response = await apiClient.get(`/doctor/${doctorId}/notices`);
  return response.data;
};
