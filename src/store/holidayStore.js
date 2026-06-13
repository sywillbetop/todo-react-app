/* 공휴일 상태 관리 파일
    --> Nager.Date API로 연도별 한국 공휴일 조회 및 캐싱
 */

import { create } from 'zustand';

const useHolidayStore = create((set, get) => ({
    // ── 상태(State) ─────────────────────────────
    holidays: {}, // 연도별 캐싱 { '2026': [{ date, localName, ... }] }

    // ── 액션(Action) ────────────────────────────
    fetchHolidays: async (year) => {
        // 이미 캐시된 연도는 재요청 생략
        if (get().holidays[year]) return;
        try {
            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/KR`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const data = await res.json();
            // 연도 키로 캐싱 (기존 데이터 유지)
            set((state) => ({
                holidays: { ...state.holidays, [year]: data }
            }));
        } catch (err) {
            console.error('fetchHolidays error:', err);
        }
    },

    // 'YYYY-MM-DD' 문자열로 해당 날짜의 공휴일 이름 반환 (없으면 null)
    getHolidayName: (dateStr) => {
        const year = dateStr.slice(0, 4);
        const list = get().holidays[year] || [];
        return list.find((h) => h.date === dateStr)?.localName ?? null;
    },
}));

export default useHolidayStore;
