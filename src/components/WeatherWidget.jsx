/* 날씨 위젯 컴포넌트
    --> 도시명으로 현재 날씨를 조회해 온도·날씨 아이콘을 표시
 */

import { useEffect, useState } from 'react';
import useWeatherStore from '../store/weatherStore';

function WeatherWidget() {
    const { weather, isLoading, error, fetchWeather } = useWeatherStore();

    const [inputCity, setInputCity] = useState('Seoul');

    // 컴포넌트 마운트 시 기본 도시 날씨 자동 조회
    useEffect(() => {
        fetchWeather('Seoul');
    }, []);

    // 엔터 키로 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputCity.trim()) {
            e.preventDefault();
            fetchWeather(inputCity.trim());
        }
    };

    return (
        <div className='p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4'>

            {/* ───────── 검색 영역 ───────── */}
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                    <input
                        type='text'
                        value={inputCity}
                        onChange={(e) => setInputCity(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='도시 영문명 (예: Seoul)'
                        className='text-sm text-gray-700 border-b border-gray-300 outline-none focus:border-blue-500 w-28 bg-transparent'
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

            {/* ───────── 날씨 정보 표시 영역 ───────── */}
            <div className='flex items-center gap-2'>
                {isLoading && <span className='text-xs text-gray-400'>로딩 중...</span>}
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
    );
}
export default WeatherWidget;
