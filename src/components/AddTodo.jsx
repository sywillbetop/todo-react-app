import { useState } from 'react';
import useTodoStore from '../store/todoStore';

/**
 * 3. 할 일 추가 컴포넌트 (AddTodo)
 */
function AddTodo() {
    // input: 입력창의 현재 텍스트 값
    // setInput: input값을 변경하는 함수
    // useState(''): 초기값은 빈 문자열
    const [input, setInput] = useState('');

    // 스토어에서 addTodo 함수만 꺼내옴
    const addTodo = useTodoStore((state) => state.addTodo);

    // 추가 버튼 클릭 또는 엔터키 입력 시 실행되는 함수
    const handleAdd = () => {
        if (!input.trim()) return; // trim()으로 앞뒤 공백 제거 후 빈 문자열이면 미작동
        addTodo(input.trim()); // 스토어에 새 할 일 추가
        setInput(''); // 입력창 init
    };
    return (
        <div className="flex gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="할 일을 입력하세요..."
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bgblue-700 active:scale-95 transition-all">
                추가
            </button>
        </div>
    );
}
export default AddTodo;