import useTodoStore from '../store/todoStore';

/**
 * @param {Object} todo - 부모로부터 전달받은 개별 할 일 객체
 */

/**
 * 2. 개별 아이템 컴포넌트 (TodoItem)
 */
function TodoItem({ todo }) {
    const { toggleTodo, deleteTodo } = useTodoStore();
    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <span className={`flex-1 ${todo.done ? 'line-through text-gray-400':'text-gray-800'}`}>
                {todo.title}
            </span>
            <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c10 2 1 2 2v2"/>
                </svg>
            </button>
        </div>
    );
}
export default TodoItem;
