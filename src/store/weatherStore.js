/**
 * 날씨 위젯 컴포넌트
 * --> 기본 기능에 도시 입력 오류에 대한 예외 추가
 */

import { create } from 'zustand';

const useWeatherStore = create((set) => ({
    // ── 상태(State) ─────────────────────────────
    weather: null, // API 응답 데이터 (성공 시 저장)
    isLoading: false, // 요청 중 여부
    error: null, // 오류 메시지
    // ── 액션(Action) ────────────────────────────
    fetchWeather: async (city) => {
        // .env의 API 키를 읽음. 없으면 undefined
        const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
        const DEFAULT_CITY = 'Seoul';

        const request = async (targetCity) => {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather` +
                `?q=${encodeURIComponent(targetCity)}` +
                `&units=metric` +
                `&appid=${API_KEY}`
            );
            // HTTP 오류 처리 (4xx, 5xx)
            if (!res.ok) {
                let msg = `${res.status} ${res.statusText}`;
                try {
                    const errData = await res.json(); // res.json() -> 응답 body를 JSON으로 파싱하여 JS객체로 변환
                    if (errData?.message) msg = `${res.status} ${errData.message}`;
                } catch { /* JSON 파싱 실패 무시 */ }
                throw new Error(msg);
            }
            return res.json();
        };

        // 요청 시작 — 로딩 ON, 이전 에러 초기화
        set({isLoading: true, error: null}); // set({ isLoading: true }) -> 지정한 키만 업데이트. 나머지 상태는 유지
        try {
            const data = await request(city);
            // 성공 — 데이터 저장, 로딩 OFF
            set({weather: data, isLoading: false, error: null});
        } catch {
            console.warn(`fetchWeather: '${city}' 조회 실패, 기본 도시(${DEFAULT_CITY})로 재시도`);
            // 입력 도시 조회 실패 시 예외처리 - 문구 플로팅 및 기본 도시(서울)로 재시도
            try {
                const fallbackData = await request(DEFAULT_CITY);
                // 폴백 성공 — 날씨는 Seoul로 표시하되, 입력 도시가 없었음을 error로 알림
                set({weather: fallbackData, isLoading: false, error: '존재하지 않는 도시입니다.'});
            } catch (fallbackErr) {
                console.error('fetchWeather fallback error:', fallbackErr);
                set({error: fallbackErr.message || '알 수 없는 오류', isLoading: false});
            }
        }
    },
}));

export default useWeatherStore;
