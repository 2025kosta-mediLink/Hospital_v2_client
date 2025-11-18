import apiClient from "./client";

/**
 * 진료과 목록 조회
 * GET /api/v2/department/list
 */
export const getDepartmentList = async () => {
  try {
    const response = await apiClient.get("/department/list");
    console.log("진료과 목록 조회 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("getDepartmentList error:", error);
    throw new Error("진료과 목록을 가져오는데 실패했습니다.");
  }
};
