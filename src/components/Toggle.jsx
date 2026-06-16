// 토글 공용 컴포넌트로 분리
// --> AddTodo, TodoItem 에서 Toggle 사용으로 코드의 중복 제거 위함
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
export default Toggle;
