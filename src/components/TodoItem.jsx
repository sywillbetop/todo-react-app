/* 할 일 항목 하나를 표시하는 컴포넌트
    --> 체크박스, 텍스트(또는 편집 input), 삭제 버튼으로 구성
 */

import { useState } from 'react'
import useTodoStore from '../store/todoStore';

/**
 * @param {Object} todo - 부모로부터 전달받은 개별 할 일 객체
 */

/**
 * 2. 개별 아이템 컴포넌트 (TodoItem)
 */

// todo: 부모(TodoPage)로부터 받아온 개별 할 일 객체 { id, title, done }
function TodoItem({ todo }) {
    // 스토어에서 필요한 액션
    const { toggleTodo, deleteTodo, updateTodo } = useTodoStore();

    // isEditing: 현재 편집 모드인지 여부 확인 (true=input 표시, false=span 표시)
    const [isEditing, setIsEditing] = useState(false)

    // editText: 퍈집 중인 임시 텍스트 (확정 전까지 todo.title에 반영 안됨)
    const [editText, setEditText] = useState('')

    // 텍스트 더블클릭 -> 편집 모드 진입
    const handleDoubleClick = () => {
        setEditText(todo.title) // 현재 텍스트를 편집창 초기값으로 설정
        setIsEditing(true)
    }

    // 수정 확정 (엔터키 or input 바깥 클릭 시 호출)
    const handleConfirm = () => {
        if(editText.trim()) {
            updateTodo(todo.id, editText.trim())
        }
        setIsEditing(false) // 빈 문자열로 수정하려 하면 원래 텍스트 유지 (수정 없이 편집 모드만 종료)
    }

    // 편집 중 키보드 입력 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleConfirm() // Enter: 수정 확정
        if (e.key === 'Escape') setIsEditing(false) // Escape: 수정 취소 (원래 텍스트 유지)
    }

    // 마감일이 오늘보다 이전이고 미완료인 경우 기한 초과로 판단
    const isOverdue = !todo.done && todo.dueDate && todo.dueDate < new Date().toISOString().slice(0, 10);

    return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            {/* 체크박스: 클릭하면 done 상태 토글*/}
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
            />

            {/* 편집 모드 여부에 따라 input 또는 span을 렌더링 */}
            {isEditing ? (
                // 편집 모드: input 표시
                <input
                    type='text'
                    value={editText}
                    autoFocus                                         // 편집 모드 진입 시 자동으로 포커스
                    onChange={(e) => setEditText(e.target.value)}    // 타이핑할 때마다 editText 업데이트
                    onBlur={handleConfirm}                           // 바깥 클릭(포커스 이탈) 시 확정
                    onKeyDown={handleKeyDown}
                    className='flex-1 outline-none border-b border-blue-400 text-gray-800'
                />
            ) : (
                // 일반 모드: span 표시, 더블클릭하면 편집 모드로 전환
                <div className="flex-1 flex flex-col">
                    <span
                        onDoubleClick={handleDoubleClick}
                        className={`cursor-pointer ${
                            // done이 true면 취소선 + 연한 색, false면 기본 색
                            todo.done ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                    >{todo.title}
                    </span>
                    {/* 마감일이 있을 때만 표시 — 기한 초과 시 빨간색 */}
                    {todo.dueDate && (
                        <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                            {isOverdue ? '⚠ ' : ''}{todo.dueDate}{todo.dueTime ? ` ${todo.dueTime}` : ' 하루종일'}
                        </span>
                    )}
                </div>
            )}

            {/* 삭제 버튼 */}
            <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
            </button>
        </div>
    );
}
export default TodoItem;
