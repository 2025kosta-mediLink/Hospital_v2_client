import { useEffect, useRef, useState, useCallback } from 'react';

function KakaoMap({ 
  latitude, 
  longitude, 
  pharmacies, 
  onPharmacyClick,
  userLocation,
  hospitalLocation,
  route,
  markerOffset = { lat: 0, lng: -0.003 }
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

      // 스크립트 동적 추가
      const script = document.createElement('script');
      script.src =
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=371a027cd1dac68dce2424d2ac0fd3ca&libraries=services&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => resolve());
      };

      document.head.appendChild(script);
    });
  }, []);

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
    [onPharmacyClick, userLocation]
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
    const markerOffset = new window.kakao.maps.Point(12, 35);
    
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
      { offset: markerOffset }
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
    if (!mapInstanceRef.current || !hospitalLocation) return;

    if (hospitalMarkerRef.current) {
      hospitalMarkerRef.current.setMap(null);
    }

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

  /** 경로 표시 */
  const updateRoute = useCallback(() => {
    if (!mapInstanceRef.current || !route) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const path = [
      new window.kakao.maps.LatLng(route.start.latitude, route.start.longitude),
      new window.kakao.maps.LatLng(route.end.latitude, route.end.longitude),
    ];

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#FF6B6B",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });

    polyline.setMap(mapInstanceRef.current);
    polylineRef.current = polyline;
  }, [route]);

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
