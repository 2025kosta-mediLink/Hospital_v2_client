import { useEffect, useRef, useState, useCallback } from 'react';

function KakaoMap({ 
  latitude, 
  longitude, 
  pharmacies, 
  onPharmacyClick,
  userLocation,
  hospitalLocation,
  route
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
      level: 4,
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

      if (!pharmacyList) return;

      pharmacyList.forEach((pharmacy) => {
        if (!pharmacy.latitude || !pharmacy.longitude) return;

        const pos = new window.kakao.maps.LatLng(pharmacy.latitude, pharmacy.longitude);

        const marker = new window.kakao.maps.Marker({
          position: pos,
          map: mapInstanceRef.current,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          onPharmacyClick?.(pharmacy);
        });

        markersRef.current.push(marker);
      });
    },
    [onPharmacyClick]
  );

  /** 사용자 위치 마커 */
  const updateUserMarker = useCallback(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    const pos = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude);

    const marker = new window.kakao.maps.Marker({
      position: pos,
      map: mapInstanceRef.current,
      // 기본 마커 사용 (이미지 없이)
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

  /** 중심점 이동 (경로 없을 때만) */
  useEffect(() => {
    if (isMapReady && !route) {
      mapInstanceRef.current?.setCenter(
        new window.kakao.maps.LatLng(latitude, longitude)
      );
    }
  }, [latitude, longitude, isMapReady, route]);

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
