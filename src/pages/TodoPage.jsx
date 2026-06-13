import useTodoStore from '../store/todoStore';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';

function TodoPage() {
// 스토어에서 전체 할 일 목록을 가져옵니다. [cite: 87]
    const todos = useTodoStore((state) => state.todos);
    return (
        <div className='min-h-screen bg-gray-50 p-6'>
            <div className='max-w-md mx-auto space-y-6'>
                {/* 헤더 섹션 */}
                <h1 className='text-3xl font-extrabold text-blue-600 textcenter'>My Tasks</h1>
                {/* 입력 컴포넌트 */}
                <AddTodo />
                {/* 목록 섹션 */}
                <div className='space-y-3'>
                    {/* todos 배열을 순회하며 TodoItem 컴포넌트를 생성합니다. [cite: 14, 72] */}
                    {todos.length > 0 ? (
                        todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))
                    ) : (
                        <p className='text-center text-gray-400 py-10'>등록된 할 일이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default TodoPage;