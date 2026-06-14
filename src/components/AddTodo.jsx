/* 할 일 추가 컴포넌트
    --> 텍스트 입력 + 날짜/시간 토글 선택 후 추가 버튼 또는 엔터키로 등록
 */

import { useState } from 'react';
import useTodoStore from '../store/todoStore';

// 토글 스위치 컴포넌트
function Toggle({ enabled, onToggle }) {
    return (
        <button
            type='button'
            onClick={onToggle}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}

function AddTodo() {
    const [input, setInput] = useState('');

    // 날짜 토글 상태
    const [dateEnabled, setDateEnabled] = useState(false);
    const [dueDate, setDueDate] = useState('');

    // 시간 토글 상태 (날짜가 켜져 있어야 활성화 가능)
    const [timeEnabled, setTimeEnabled] = useState(false);
    const [dueTime, setDueTime] = useState('');

    const addTodo = useTodoStore((state) => state.addTodo);

    // 날짜 토글 끄면 시간도 같이 초기화
    const handleDateToggle = () => {
        const next = !dateEnabled;
        setDateEnabled(next);
        if (!next) {
            setDueDate('');
            setTimeEnabled(false);
            setDueTime('');
        }
    };

    // 시간 토글 끄면 시간 초기화
    const handleTimeToggle = () => {
        const next = !timeEnabled;
        setTimeEnabled(next);
        if (!next) setDueTime('');
    };

    const handleAdd = () => {
        if (!input.trim()) return;
        addTodo(
            input.trim(),
            dateEnabled ? dueDate || null : null,
            timeEnabled ? dueTime || null : null,
        );
        setInput('');
        setDateEnabled(false);
        setDueDate('');
        setTimeEnabled(false);
        setDueTime('');
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">

            {/* 텍스트 입력 + 추가 버튼 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
                    }}
                    placeholder="할 일을 입력하세요..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
                    추가
                </button>
            </div>

            {/* 날짜 / 시간 토글 영역 */}
            <div className="flex gap-4 h-10 items-center">

                {/* 날짜 토글 */}
                <div className="flex items-center gap-2">
                    <Toggle enabled={dateEnabled} onToggle={handleDateToggle} />
                    <span className="text-xs text-gray-500">날짜</span>
                    {dateEnabled && (
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-36 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                        />
                    )}
                </div>

                {/* 시간 토글 — 날짜가 켜져 있을 때만 표시 */}
                {dateEnabled && (
                    <div className="flex items-center gap-2">
                        <Toggle enabled={timeEnabled} onToggle={handleTimeToggle} />
                        <span className="text-xs text-gray-500">시간</span>
                        {timeEnabled && (
                            <input
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-36 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                            />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
export default AddTodo;
