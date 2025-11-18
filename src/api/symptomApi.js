import apiClient from "./client";

/**
 * 증상 목록 조회
 * GET /api/v2/symptoms
 *
 * @returns {Promise<ApiResponse>}
 */
export const getSymptoms = async () => {
  try {
    const response = await apiClient.get("/symptoms");
    console.log("[API] getSymptoms 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] getSymptoms 에러:", error);
    throw new Error("증상 목록을 불러오는데 실패했습니다.");
  }
};
