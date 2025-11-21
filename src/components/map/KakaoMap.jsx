import { useEffect, useRef, useState, useCallback } from 'react';

function KakaoMap({ 
  latitude, 
  longitude, 
  pharmacies, 
  onPharmacyClick,
  userLocation,
  hospitalLocation,
  route,
  markerOffset = { lat: 0.010, lng: 0.003 },
  useIndexScript = false, // index.html의 스크립트를 사용할지 여부
  onRouteInfoUpdate // 경로 정보 업데이트 콜백 (거리, 시간)
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const hospitalMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  const [isMapReady, setIsMapReady] = useState(false);

  /** ✅ Kakao SDK 로더 */
  const loadKakaoMapSDK = useCallback(() => {
    return new Promise((resolve) => {
      // 이미 로드됨
      if (window.kakao && window.kakao.maps) {
        resolve();
        return;
      }

      // index.html의 스크립트를 사용하는 경우 (조제상황 페이지)
      if (useIndexScript) {
        // index.html에서 이미 스크립트를 로드하고 있으므로, 로드될 때까지 대기
        const checkKakao = () => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.services && window.kakao.maps.services.Directions) {
            console.log('카카오 지도 API 및 Directions 서비스 로드 완료');
            resolve();
          } else {
            console.log('카카오 지도 API 로드 대기 중...', {
              kakao: !!window.kakao,
              maps: !!(window.kakao && window.kakao.maps),
              services: !!(window.kakao && window.kakao.maps && window.kakao.maps.services),
              Directions: !!(window.kakao && window.kakao.maps && window.kakao.maps.services && window.kakao.maps.services.Directions)
            });
            setTimeout(checkKakao, 100);
          }
        };
        
        // 약간의 지연 후 확인 시작
        setTimeout(checkKakao, 100);
        return;
      }

      // 동적 스크립트 추가 (약국 검색 페이지)
      const script = document.createElement('script');
      script.src =
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=371a027cd1dac68dce2424d2ac0fd3ca&libraries=services&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => resolve());
      };

      document.head.appendChild(script);
    });
  }, [useIndexScript]);

  /** 지도 생성 */
  const createMap = useCallback(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;

    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3, 
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;
    setIsMapReady(true);
  }, [latitude, longitude]);

  /** 약국 마커 업데이트 */
  const updateMarkers = useCallback(
    (pharmacyList) => {
      if (!mapInstanceRef.current) return;

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      const bounds = new window.kakao.maps.LatLngBounds();

      // 현재 위치를 bounds에 추가
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        bounds.extend(new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude));
      }

      if (pharmacyList && pharmacyList.length > 0) {
        pharmacyList.forEach((pharmacy) => {
          if (!pharmacy.latitude || !pharmacy.longitude) return;

          const pos = new window.kakao.maps.LatLng(pharmacy.latitude, pharmacy.longitude);
          bounds.extend(pos);

          // 약국 마커: 파란색 핀 마커 (2번 이미지 스타일)
          const markerSize = new window.kakao.maps.Size(24, 35);
          const markerOffset = new window.kakao.maps.Point(12, 35);
          
          const canvas = document.createElement('canvas');
          canvas.width = 24;
          canvas.height = 35;
          const ctx = canvas.getContext('2d');
          
          // 파란색 핀 본체
          ctx.beginPath();
          ctx.arc(12, 12, 10, 0, Math.PI, true); // 위쪽 반원
          ctx.lineTo(12, 30); // 아래쪽 뾰족한 부분
          ctx.closePath();
          ctx.fillStyle = '#3B82F6'; // 파란색
          ctx.fill();
          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // 중앙 흰색 원
          ctx.beginPath();
          ctx.arc(12, 12, 6, 0, 2 * Math.PI);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          
          const markerImage = new window.kakao.maps.MarkerImage(
            canvas.toDataURL(),
            markerSize,
            { offset: markerOffset }
          );

          const marker = new window.kakao.maps.Marker({
            position: pos,
            map: mapInstanceRef.current,
            image: markerImage,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            onPharmacyClick?.(pharmacy);
          });

          markersRef.current.push(marker);
        });
      }

      // 모든 마커와 현재 위치가 보이도록 지도 범위 조정
      if (pharmacyList && pharmacyList.length > 0) {
        // 약국이 있으면 약국과 현재 위치 모두 포함
        // 약국이 하나만 선택된 경우(모달이 열렸을 때) 여유 공간을 주기 위해 padding 추가
        if (pharmacyList.length === 1) {
          // 단일 약국 선택 시: padding을 주어 두 마커가 화면에 잘 보이도록
          // 상, 우, 하, 좌 순서로 padding 설정 (하단은 약국 상세 카드 공간 확보)
          const topPadding = 50;
          const rightPadding = 50;
          const bottomPadding = 200; // 하단 약국 상세 카드 공간 확보
          const leftPadding = 50;
          mapInstanceRef.current.setBounds(bounds, topPadding, rightPadding, bottomPadding, leftPadding);
        } else {
          // 여러 약국이 있을 때: 약국 리스트에 가려지지 않는 영역만 고려하여 범위 조정
          // 하단 약국 리스트 공간을 제외한 영역만 고려
          const topPadding = 50;
          const rightPadding = 50;
          const bottomPadding = 150; // 하단 약국 리스트 오버레이 공간 확보
          const leftPadding = 50;
          mapInstanceRef.current.setBounds(bounds, topPadding, rightPadding, bottomPadding, leftPadding);
          
          // 현재 위치(강북삼성병원)를 지정된 위치에 고정
          // markerOffset을 사용하여 현재 위치 마커가 보이는 위치를 조정
          if (userLocation && userLocation.latitude && userLocation.longitude) {
            const userPos = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude);
            
            // 오프셋을 적용하여 지도 중심 계산
            // 오프셋을 빼면 지도 중심이 이동하여 마커가 원하는 위치에 보임
            const adjustedLat = userPos.getLat() - markerOffset.lat;
            const adjustedLng = userPos.getLng() - markerOffset.lng;
            
            const adjustedCenter = new window.kakao.maps.LatLng(adjustedLat, adjustedLng);
            mapInstanceRef.current.setCenter(adjustedCenter);
          }
          
          mapInstanceRef.current.setLevel(3);
        }
      } else if (userLocation && userLocation.latitude) {
        // 약국이 없으면 현재 위치만 중심으로
        mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude));
        mapInstanceRef.current.setLevel(3);
      }
    },
    [onPharmacyClick, userLocation, markerOffset]
  );

  /** 사용자 위치 마커 */
  const updateUserMarker = useCallback(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (!window.kakao || !window.kakao.maps) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const pos = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude);

    // 현재 위치 마커: 빨간색 핀 마커 (별 표시 포함)
    const markerSize = new window.kakao.maps.Size(24, 35);
    const markerImageOffset = new window.kakao.maps.Point(12, 35);
    
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 40; // 핀 + 그림자 공간
    const ctx = canvas.getContext('2d');
    
    // 빨간색 받침대 (그림자)
    ctx.beginPath();
    ctx.ellipse(12, 36, 8, 3, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#DC2626'; // 빨간색
    ctx.fill();
    
    // 빨간색 핀 본체
    ctx.beginPath();
    ctx.arc(12, 12, 10, 0, Math.PI, true); // 위쪽 반원
    ctx.lineTo(12, 30); // 아래쪽 뾰족한 부분
    ctx.closePath();
    ctx.fillStyle = '#EF4444'; // 밝은 빨간색
    ctx.fill();
    ctx.strokeStyle = '#B91C1C'; // 어두운 빨간색 테두리
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // 중앙 흰색 별 그리기
    const centerX = 12;
    const centerY = 12;
    const outerRadius = 6;
    const innerRadius = 3;
    const spikes = 5;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    
    const markerImage = new window.kakao.maps.MarkerImage(
      canvas.toDataURL(),
      markerSize,
      { offset: markerImageOffset }
    );

    const marker = new window.kakao.maps.Marker({
      position: pos,
      map: mapInstanceRef.current,
      image: markerImage,
    });

    userMarkerRef.current = marker;
  }, [userLocation]);

  /** 병원 위치 마커 */
  const updateHospitalMarker = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // 기존 마커 제거
    if (hospitalMarkerRef.current) {
      hospitalMarkerRef.current.setMap(null);
      hospitalMarkerRef.current = null;
    }

    // hospitalLocation이 없으면 마커를 표시하지 않음
    if (!hospitalLocation) return;

    const pos = new window.kakao.maps.LatLng(
      hospitalLocation.latitude,
      hospitalLocation.longitude
    );

    const marker = new window.kakao.maps.Marker({
      position: pos,
      map: mapInstanceRef.current,
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 12) }
      ),
    });

    hospitalMarkerRef.current = marker;
  }, [hospitalLocation]);

  /** 간단한 거리 계산 (직선거리) */
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // 미터 단위
  }, []);

  /** 경로 정보를 DOM에 업데이트 */
  const updateRouteInfo = useCallback((distance, duration) => {
    if (!onRouteInfoUpdate) {
      // 콜백이 없으면 직접 DOM 업데이트
      const distanceElement = document.getElementById('routeDistance');
      const durationElement = document.getElementById('routeDuration');
      
      if (distanceElement && durationElement) {
        // 거리 표시 (미터를 적절한 단위로 변환)
        if (distance < 1000) {
          distanceElement.textContent = `${Math.round(distance)}m`;
        } else {
          distanceElement.textContent = `${(distance / 1000).toFixed(1)}km`;
        }
        
        // 시간 표시 (초를 분으로 변환)
        const durationMin = Math.round(duration / 60);
        durationElement.textContent = `${durationMin}분`;
      }
    } else {
      // 콜백 사용
      onRouteInfoUpdate({ distance, duration });
    }
  }, [onRouteInfoUpdate]);

  /** 경로 표시 - REST API 기반 */
  const updateRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !route) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    try {
      // 백엔드 API에 맞게 POST 요청
      const requestBody = {
        startLatitude: route.start.latitude,
        startLongitude: route.start.longitude,
        endLatitude: route.end.latitude,
        endLongitude: route.end.longitude,
        type: 'foot' // 도보 경로
      };

      const res = await fetch('/api/kakao/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error(`route api error: ${res.status}`);
      }

      const data = await res.json();
      console.log('경로 API 응답 전체:', JSON.stringify(data, null, 2));
      console.log('경로 API 응답 (간단):', data);

      // 백엔드 응답 구조에 맞게 경로 데이터 추출
      if (!data || !data.routes || data.routes.length === 0) {
        console.error('경로 데이터가 없습니다. 응답:', data);
        throw new Error('경로 데이터가 없습니다.');
      }

      const routeData = data.routes[0];
      console.log('첫 번째 경로 데이터:', routeData);
      
      if (!routeData.sections || routeData.sections.length === 0) {
        console.error('경로 섹션이 없습니다. routeData:', routeData);
        throw new Error('경로 섹션이 없습니다.');
      }

      console.log('섹션 개수:', routeData.sections.length);
      routeData.sections.forEach((section, idx) => {
        console.log(`섹션 ${idx}:`, section);
        console.log(`섹션 ${idx} roads:`, section.roads);
      });

      // 경로 포인트 추출 (카카오 모빌리티 API 응답 구조에 맞게)
      const path = [];
      const bounds = new window.kakao.maps.LatLngBounds();
      
      // 출발지와 도착지 추가
      const start = new window.kakao.maps.LatLng(route.start.latitude, route.start.longitude);
      const end = new window.kakao.maps.LatLng(route.end.latitude, route.end.longitude);
      bounds.extend(start);
      bounds.extend(end);

      // 섹션에서 경로 포인트 추출
      let hasPathPoints = false;
      routeData.sections.forEach((section, sectionIdx) => {
        console.log(`섹션 ${sectionIdx} 처리 시작`);
        if (section.roads && Array.isArray(section.roads)) {
          console.log(`섹션 ${sectionIdx}에 ${section.roads.length}개의 도로가 있습니다.`);
          section.roads.forEach((road, roadIdx) => {
            console.log(`도로 ${roadIdx} 처리:`, road);
            if (road.vertexes && Array.isArray(road.vertexes) && road.vertexes.length > 0) {
              console.log(`도로 ${roadIdx}에 ${road.vertexes.length}개의 vertexes가 있습니다.`);
              hasPathPoints = true;
              for (let i = 0; i < road.vertexes.length; i += 2) {
                if (i + 1 < road.vertexes.length) {
                  const lng = road.vertexes[i];     // x 좌표 (경도)
                  const lat = road.vertexes[i + 1]; // y 좌표 (위도)
                  const point = new window.kakao.maps.LatLng(lat, lng);
                  path.push(point);
                  bounds.extend(point);
                }
              }
            } else {
              console.warn(`도로 ${roadIdx}에 vertexes가 없거나 배열이 아닙니다:`, road.vertexes);
            }
          });
        } else {
          console.warn(`섹션 ${sectionIdx}에 roads가 없거나 배열이 아닙니다:`, section.roads);
        }
      });

      console.log(`추출된 경로 포인트 수: ${path.length}, hasPathPoints: ${hasPathPoints}`);

      // 경로가 없으면 직선 경로로 대체
      if (path.length < 2) {
        console.warn('경로 포인트가 부족하여 직선 경로로 대체합니다.');
        path.length = 0;
        path.push(start, end);
      } else {
        // 경로가 있으면 출발지와 도착지도 추가
        path.unshift(start);
        path.push(end);
      }

      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 8,
        strokeColor: '#2563eb',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });

      polyline.setMap(mapInstanceRef.current);
      polylineRef.current = polyline;

      // 지도를 경로에 맞게 자동 조정
      const mapContainer = mapRef.current;
      if (mapContainer) {
        const containerWidth = mapContainer.offsetWidth;
        const containerHeight = mapContainer.offsetHeight;
        const padding = Math.min(containerWidth, containerHeight) * 0.05;
        mapInstanceRef.current.setBounds(bounds, padding);
      } else {
        mapInstanceRef.current.setBounds(bounds, 0);
      }

      // 경로 정보 업데이트 (거리, 시간)
      // summary에서 전체 경로 정보 가져오기 (summary가 전체 경로의 총합)
      let distance = routeData.summary?.distance || 0;
      let duration = routeData.summary?.duration || 0;

      // summary에 없으면 sections에서 합산
      if (!distance && routeData.sections && routeData.sections.length > 0) {
        distance = routeData.sections.reduce((sum, section) => sum + (section.distance || 0), 0);
      }
      if (!duration && routeData.sections && routeData.sections.length > 0) {
        duration = routeData.sections.reduce((sum, section) => sum + (section.duration || 0), 0);
      }

      // duration이 여전히 없으면 distance 기반으로 추정 (도보: 분속 80m 기준, 초 단위)
      if (!duration || duration === 0) {
        if (distance > 0) {
          // 분속 80m = 초속 1.33m, 따라서 duration(초) = distance(미터) / 1.33
          duration = Math.round(distance / 1.33);
        }
      }

      console.log('경로 정보 - distance:', distance, 'duration:', duration);
      console.log('summary:', routeData.summary);
      console.log('sections:', routeData.sections);

      // distance가 있으면 duration도 추정했으므로 업데이트 호출
      if (onRouteInfoUpdate && distance > 0) {
        console.log('경로 정보 업데이트 호출:', { distance, duration });
        onRouteInfoUpdate({
          distance: distance,
          duration: duration || 0
        });
      } else {
        console.warn('경로 정보 업데이트 호출 안함:', { distance, duration, hasCallback: !!onRouteInfoUpdate });
      }

    } catch (err) {
      console.error('경로 API 실패:', err);
      // 실패 시 직선 경로로 대체
      const start = new window.kakao.maps.LatLng(route.start.latitude, route.start.longitude);
      const end = new window.kakao.maps.LatLng(route.end.latitude, route.end.longitude);
      
      const polyline = new window.kakao.maps.Polyline({
        path: [start, end],
        strokeWeight: 8,
        strokeColor: '#2563eb',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });

      polyline.setMap(mapInstanceRef.current);
      polylineRef.current = polyline;

      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(start);
      bounds.extend(end);

      const mapContainer = mapRef.current;
      if (mapContainer) {
        const containerWidth = mapContainer.offsetWidth;
        const containerHeight = mapContainer.offsetHeight;
        const padding = Math.min(containerWidth, containerHeight) * 0.05;
        mapInstanceRef.current.setBounds(bounds, padding);
      } else {
        mapInstanceRef.current.setBounds(bounds, 0);
      }

      // 직선거리 계산 및 표시
      const distance = calculateDistance(route.start.latitude, route.start.longitude, route.end.latitude, route.end.longitude);
      const estimatedTime = Math.round(distance / 80) * 60;
      
      if (onRouteInfoUpdate) {
        onRouteInfoUpdate({
          distance: distance,
          duration: estimatedTime
        });
      }
    }
  }, [route, onRouteInfoUpdate, calculateDistance]);

  /** 초기 로딩 */
  useEffect(() => {
    let isMounted = true;

    loadKakaoMapSDK().then(() => {
      if (isMounted) {
        createMap();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadKakaoMapSDK, createMap]);

  /** 마커/경로 업데이트 */
  useEffect(() => {
    if (!isMapReady) return;

    updateMarkers(pharmacies);
  }, [pharmacies, isMapReady, updateMarkers]);

  useEffect(() => {
    if (!isMapReady) return;

    updateUserMarker();
  }, [userLocation, isMapReady, updateUserMarker]);

  useEffect(() => {
    if (!isMapReady) return;

    updateHospitalMarker();
  }, [hospitalLocation, isMapReady, updateHospitalMarker]);

  useEffect(() => {
    if (!isMapReady) return;

    updateRoute();
  }, [route, isMapReady, updateRoute]);

  /** 중심점 이동 (경로 없을 때만, 약국 마커가 없을 때만) */
  useEffect(() => {
    if (isMapReady && !route && mapInstanceRef.current) {
      // 약국 마커가 있으면 약국 마커 업데이트에서 bounds를 설정하므로 여기서는 설정하지 않음
      if (!pharmacies || pharmacies.length === 0) {
        const center = new window.kakao.maps.LatLng(latitude, longitude);
        mapInstanceRef.current.setCenter(center);
      }
    }
  }, [latitude, longitude, isMapReady, route, pharmacies]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}

export default KakaoMap;
