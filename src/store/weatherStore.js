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
        // 요청 시작 — 로딩 ON, 이전 에러 초기화
        set({isLoading: true, error: null}); // set({ isLoading: true }) -> 지정한 키만 업데이트. 나머지 상태는 유지
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather` +
                `?q=${encodeURIComponent(city)}` +
                `&units=metric` +
                `&appid=${API_KEY}`
            );
            // HTTP 오류 처리 (4xx, 5xx)
            if (!res.ok) {
                let msg = `${res.status} ${res.statusText}`;
                try {
                    const errData = await res.json(); // res.json() -> 응답 body를 JSON으로 파싱하여 JS객체로 변환
                    if (errData?.message) msg = `${res.status} ${errData.message}`;
                } catch { /* JSON 파싱 실패 무시 */}
                throw new Error(msg);
            }
            const data = await res.json();
            // 성공 — 데이터 저장, 로딩 OFF
            set({weather: data, isLoading: false, error: null});
        } catch (err) {
            console.error('fetchWeather error:', err);
            // 실패 — 에러 메시지 저장, 로딩 OFF
            set({error: err.message || '알 수 없는 오류', isLoading: false});
        }
    },
}));

export default useWeatherStore;