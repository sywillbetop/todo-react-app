import { useState } from 'react';
import useTodoStore from '../store/todoStore';

/**
 * 3. 할 일 추가 컴포넌트 (AddTodo)
 */
function AddTodo() {
    const [input, setInput] = useState('');
    const addTodo = useTodoStore((state) => state.addTodo);
    const handleAdd = () => {
        if (!input.trim()) return;
        addTodo(input.trim());
        setInput('');
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