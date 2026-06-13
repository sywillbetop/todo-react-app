/* 달력 위젯 컴포넌트
    --> 마감일이 등록된 날짜에 점 표시
    --> 공휴일 표시 (Nager.Date API)
    --> 날짜 클릭 시 해당 날의 할 일 목록 표시
 */

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './CalendarWidget.css';
import useTodoStore from '../store/todoStore';
import useHolidayStore from '../store/holidayStore';

function CalendarWidget() {
    const todos = useTodoStore((state) => state.todos);
    const { fetchHolidays, getHolidayName } = useHolidayStore();

    const [selectedDate, setSelectedDate] = useState(null); // 클릭한 날짜
    const [activeYear, setActiveYear] = useState(new Date().getFullYear()); // 현재 보이는 연도

    // 연도가 바뀔 때마다 공휴일 데이터 조회 (캐시 있으면 스킵)
    useEffect(() => {
        fetchHolidays(activeYear);
    }, [activeYear]);

    // 마감일이 있는 날짜 목록 (Set으로 중복 제거)
    const dueDates = new Set(todos.map((t) => t.dueDate).filter(Boolean));

    // 선택한 날짜의 할 일 목록
    const selectedTodos = selectedDate
        ? todos.filter((t) => t.dueDate === toDateString(selectedDate))
        : [];

    // Date 객체를 'YYYY-MM-DD' 문자열로 변환
    function toDateString(date) {
        return date.toLocaleDateString('sv-SE'); // sv-SE 로케일은 YYYY-MM-DD 형식 반환
    }

    // 날짜 클릭 시 — 같은 날짜 재클릭하면 선택 해제
    const handleDateClick = (date) => {
        const str = toDateString(date);
        setSelectedDate((prev) => (prev && toDateString(prev) === str ? null : date));
    };

    // 달력 월 이동 시 연도 추적 (연도 넘어갈 때 공휴일 재조회)
    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setActiveYear(activeStartDate.getFullYear());
    };

    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>

            {/* ───────── 달력 ───────── */}
            <Calendar
                onClickDay={handleDateClick}
                onActiveStartDateChange={handleActiveStartDateChange}
                value={selectedDate}
                // 마감일 있는 날짜에 파란 점, 공휴일 이름 표시
                tileContent={({ date }) => {
                    const dateStr = toDateString(date);
                    const holidayName = getHolidayName(dateStr);
                    const hasTodo = dueDates.has(dateStr);
                    if (!holidayName && !hasTodo) return null;
                    return (
                        <div className='flex flex-col items-center gap-0.5 mt-0.5'>
                            {/* 공휴일 이름 */}
                            {holidayName && (
                                <span className='text-[9px] text-red-400 leading-none w-full text-center truncate'>
                                    {holidayName}
                                </span>
                            )}
                            {/* 마감 할 일 파란 점 */}
                            {hasTodo && (
                                <span className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                            )}
                        </div>
                    );
                }}
                // 일요일 + 공휴일은 빨간색 클래스 적용
                tileClassName={({ date }) => {
                    const classes = [];
                    if (date.getDay() === 0) classes.push('sunday');
                    if (getHolidayName(toDateString(date))) classes.push('holiday');
                    return classes.join(' ') || null;
                }}
                locale='ko-KR'
                calendarType='gregory'
                formatDay={(_, date) => date.getDate()}
                className='w-full border-none'
            />

            {/* ───────── 선택 날짜의 정보 ───────── */}
            {selectedDate && (
                <div className='p-4 border-t border-gray-100'>
                    <div className='flex items-center gap-2 mb-2'>
                        <p className='text-xs font-semibold text-gray-500'>
                            {toDateString(selectedDate)}
                        </p>
                        {/* 공휴일이면 이름 배지 표시 */}
                        {getHolidayName(toDateString(selectedDate)) && (
                            <span className='text-xs text-red-400 font-medium'>
                                {getHolidayName(toDateString(selectedDate))}
                            </span>
                        )}
                    </div>
                    {selectedTodos.length > 0 ? (
                        <ul className='space-y-1'>
                            {selectedTodos.map((todo) => (
                                <li key={todo.id} className='flex items-center gap-2 text-sm'>
                                    {/* 완료 여부에 따라 스타일 변경 */}
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${todo.done ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                    <span className={todo.done ? 'line-through text-gray-400' : 'text-gray-700'}>
                                        {todo.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-xs text-gray-400'>등록된 할 일이 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}
export default CalendarWidget;
