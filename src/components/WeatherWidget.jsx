/* 날씨 위젯 컴포넌트
    --> 도시명으로 현재 날씨를 조회해 온도·날씨 아이콘을 표시
    --> 검색 영역은 토글 버튼으로 접었다 펼 수 있음
 */

import { useEffect, useState } from 'react';
import useWeatherStore from '../store/weatherStore';

function WeatherWidget() {
    // 스토어에서 상태와 액션을 가져옴
    const { weather, isLoading, error, fetchWeather } = useWeatherStore();

    const [inputCity, setInputCity] = useState('Seoul'); // 입력 중인 임시 텍스트
    const [isOpen, setIsOpen] = useState(true); // true=검색 영역 펼침, false=접힘

    // 컴포넌트 마운트 시 기본 도시 날씨 자동 조회
    useEffect(() => {
        fetchWeather('Seoul');
    }, []); // 빈 배열 = 마운트 시 한 번만 실행

    // 엔터 키로 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputCity.trim()) {
            e.preventDefault();
            fetchWeather(inputCity.trim());
        }
    };

    return (
        <div className='p-4 bg-white rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center gap-4'>

                {/* ───────── 토글 버튼 ───────── */}
                {/* 검색 영역 왼쪽에 배치 — 클릭 시 isOpen 반전 */}
                {/* 펼쳐진 상태: ›, 접힌 상태: ‹ */}
                {/* self-stretch: 부모 높이 전체를 클릭 영역으로 사용 */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className='self-stretch px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center'
                    aria-label={isOpen ? '검색 접기' : '검색 펼치기'}
                >
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                         viewBox='0 0 24 24' fill='none' stroke='currentColor'
                         strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d={isOpen ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'}/>
                    </svg>
                </button>

                {/* ───────── 검색 영역 ───────── */}
                {/* isOpen이 true일 때만 렌더링 */}
                {isOpen && (
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='text'
                                value={inputCity}
                                onChange={(e) => setInputCity(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder='도시 영문명 (예: Seoul)'
                                className='text-sm font-semibold text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500 w-32 bg-transparent'
                            />
                            {/* 돋보기 버튼 클릭 시 fetchWeather 호출 */}
                            <button
                                onClick={() => inputCity.trim() && fetchWeather(inputCity.trim())}
                                className='p-1.5 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors'
                                aria-label='날씨 검색'
                            >
                                <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'
                                     viewBox='0 0 24 24' fill='none' stroke='currentColor'
                                     strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                    <circle cx='11' cy='11' r='8'/>
                                    <path d='M21 21l-4.35-4.35'/>
                                </svg>
                            </button>
                        </div>
                        {/* 존재하지 않는 도시 검색 시 에러 문구 */}
                        {error && !isLoading && (
                            <p className='text-xs text-red-400'>존재하지 않는 도시입니다.</p>
                        )}
                    </div>
                )}

                {/* ───────── 날씨 정보 표시 영역 ───────── */}
                <div className='flex items-center gap-2'>
                    {/* 로딩 상태 */}
                    {isLoading && (
                        <span className='text-xs text-gray-400'>로딩 중...</span>
                    )}
                    {/* 성공 상태 — 아이콘 + 온도 + 날씨 설명 + 지역명 */}
                    {weather && !isLoading && (
                        <>
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                alt='weather icon'
                                className='w-10 h-10'
                            />
                            <div className='text-right'>
                                <p className='text-xs text-gray-400'>{weather.name}</p>
                                <p className='text-lg font-bold text-gray-800'>
                                    {Math.round(weather.main.temp)}°C
                                </p>
                                <p className='text-xs text-gray-500 capitalize'>
                                    {weather.weather[0].description}
                                </p>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
export default WeatherWidget;
