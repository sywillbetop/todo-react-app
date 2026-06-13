/* 할 일 추가 컴포넌트
    --> 텍스트 입력 + 마감일 선택 후 추가 버튼 또는 엔터키로 등록
 */

import { useState } from 'react';
import useTodoStore from '../store/todoStore';

function AddTodo() {
    // input: 입력창의 현재 텍스트 값
    const [input, setInput] = useState('');
    // dueDate: 선택한 마감일 ('YYYY-MM-DD' 형식, 미선택 시 빈 문자열)
    const [dueDate, setDueDate] = useState('');

    // 스토어에서 addTodo 함수만 꺼내옴
    const addTodo = useTodoStore((state) => state.addTodo);

    // 추가 버튼 클릭 또는 엔터키 입력 시 실행되는 함수
    const handleAdd = () => {
        if (!input.trim()) return; // trim()으로 앞뒤 공백 제거 후 빈 문자열이면 미작동
        addTodo(input.trim(), dueDate || null); // 마감일 미선택 시 null로 저장
        setInput('');   // 입력창 초기화
        setDueDate(''); // 마감일 초기화
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 텍스트 입력 + 추가 버튼 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd()
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

            {/* 마감일 선택 */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">마감일</span>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                />
                {/* 마감일이 선택된 경우 초기화 버튼 표시 */}
                {dueDate && (
                    <button
                        onClick={() => setDueDate('')}
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
export default AddTodo;
