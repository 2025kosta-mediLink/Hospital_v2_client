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
    return response.data;
  } catch (error) {
    console.error("[API] getSymptoms 에러:", error);
    throw error;
  }
};
