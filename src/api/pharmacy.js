import apiClient from './client';

// 카카오 REST API 키
const KAKAO_REST_API_KEY = 'af11d187f48df0ed2268e7e2afbbfc45';

// 약국 관련 API
export const pharmacyApi = {
  // 카카오 REST API로 직접 약국 검색 (백엔드 거치지 않음)
  async search(params) {
    const { latitude, longitude, radius = 2000 } = params;
    
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent('약국')}&x=${longitude}&y=${latitude}&radius=${radius}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 카카오 API 응답을 프론트엔드 형식으로 변환
      if (data.documents && data.documents.length > 0) {
        const pharmacies = data.documents
          .filter(place => {
            // 약국만 필터링
            const isPharmacy = place.category_group_code === 'PM9' || 
                              place.place_name.includes('약국') || 
                              place.category_name.includes('약국');
            
            // 약국이 아닌 것들 제외
            const isNotOtherBusiness = !place.place_name.includes('스타벅스') &&
                                      !place.place_name.includes('카페') &&
                                      !place.place_name.includes('편의점');
            
            return isPharmacy && isNotOtherBusiness;
          })
          .map(place => {
            // 거리 계산
            const distance = calculateDistance(
              latitude, longitude,
              parseFloat(place.y), parseFloat(place.x)
            );
            
            // 별점 생성 (3.5 ~ 5.0 사이, 0.5 단위) - 약국 ID 기반으로 일관성 유지
            const idHash = place.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const rating = ((idHash % 4) * 0.5) + 3.5;
            
            // 약국마다 다른 영업 상태 - 약국 ID 기반으로 일관성 유지 (80%는 영업중, 20%는 영업종료)
            const isOpenByDefault = (idHash % 10) < 8; // 80%는 기본적으로 영업중
            const isOpen = isOpenByDefault ? checkIsOpen() : false;
            
            return {
              pharmacyId: place.id,
              name: place.place_name,
              address: place.road_address_name || place.address_name,
              phoneNumber: place.phone || '',
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
              distanceMeters: distance,
              rating: rating,
              open: isOpen,
              status: isOpen ? 'OPEN' : 'CLOSED'
            };
          });
        
        // 기본 정렬은 거리순 (나중에 필터에서 변경 가능)
        // pharmacies.sort((a, b) => a.distanceMeters - b.distanceMeters);
        
        return {
          center: { latitude, longitude },
          radius,
          items: pharmacies
        };
      }
      
      return {
        center: { latitude, longitude },
        radius,
        items: []
      };
    } catch (error) {
      console.error('약국 검색 오류:', error);
      throw error;
    }
  },
  
  // 백엔드 API로 처방전 전송
  async send(payload) {
    const { data } = await apiClient.post('/prescriptions/pharmacies', payload);
    return data;
  },

  // 카카오 API로 약국 이름으로 검색 (조제 상황 페이지용)
  async searchByName(pharmacyName, centerLat = 37.5685, centerLng = 126.9672) {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(pharmacyName)}&x=${centerLng}&y=${centerLat}&radius=5000`,
        {
          method: 'GET',
          headers: {
            'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        // 약국 이름으로 필터링 (정확한 매칭 우선)
        const exactMatch = data.documents.find(place => 
          place.place_name === pharmacyName || 
          place.place_name.includes(pharmacyName)
        );
        
        const targetPlace = exactMatch || data.documents[0];
        
        return {
          pharmacyId: targetPlace.id,
          name: targetPlace.place_name,
          address: targetPlace.road_address_name || targetPlace.address_name,
          phoneNumber: targetPlace.phone || '',
          latitude: parseFloat(targetPlace.y),
          longitude: parseFloat(targetPlace.x),
        };
      }
      
      return null;
    } catch (error) {
      console.error('약국 검색 오류:', error);
      return null;
    }
  }
};

// 거리 계산 함수 (미터)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// 영업 상태 확인 (간단한 로직)
function checkIsOpen() {
  const hour = new Date().getHours();
  return hour >= 9 && hour <= 21;
}