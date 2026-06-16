/* 할 일 항목 하나를 표시하는 컴포넌트
    --> 체크박스, 텍스트(또는 편집 폼), 삭제 버튼으로 구성
    --> 제목 더블클릭 시 편집 모드 진입 (제목·날짜·시간·카테고리 수정 가능)
 */

import { useState, useRef } from 'react'
import useTodoStore from '../store/todoStore';
import useCategoryStore from '../store/categoryStore';
import Toggle from './Toggle';
import { checkIsOverdue, getTodayString } from '../utils/todoUtils';

/**
 * @param {Object} todo - 부모로부터 전달받은 개별 할 일 객체 { id, title, done, dueDate, dueTime, categoryId }
 */
function TodoItem({ todo }) {
    const { toggleTodo, deleteTodo, updateTodo } = useTodoStore();
    const { categories, getCategoryById } = useCategoryStore();

    // 현재 todo에 연결된 카테고리 객체 (없으면 null)
    const category = todo.categoryId ? getCategoryById(todo.categoryId) : null;

    // isEditing: 편집 모드 여부 (true = 편집 폼, false = 읽기 표시)
    const [isEditing, setIsEditing] = useState(false)

    // 편집 중 변경 전 원본에 영향 없이 임시로 보관하는 값들
    const [editText, setEditText] = useState('')
    const [editDate, setEditDate] = useState('')
    const [editTime, setEditTime] = useState('')
    const [editCategoryId, setEditCategoryId] = useState(null)

    // 편집 영역 컨테이너 참조 — 포커스 이탈 감지에 사용
    const editContainerRef = useRef(null)

    // 편집 영역 내 요소 간 포커스 이동은 무시하고, 완전히 외부로 나갈 때만 저장
    // e.relatedTarget: 포커스를 받은 다음 요소. 컨테이너 안에 있으면 편집 유지
    const handleEditBlur = (e) => {
        if (!editContainerRef.current?.contains(e.relatedTarget)) {
            handleConfirm();
        }
    }

    // 제목 더블클릭 → 편집 모드 진입, 현재 값으로 편집 상태 초기화
    const handleDoubleClick = () => {
        setEditText(todo.title)
        setEditDate(todo.dueDate || '')
        setEditTime(todo.dueTime || '')
        setEditCategoryId(todo.categoryId)
        setIsEditing(true)
    }

    // 수정 확정 — 빈 제목이면 취소처럼 동작 (원래 값 유지)
    const handleConfirm = () => {
        if (!editText.trim()) {
            setIsEditing(false)
            return
        }
        updateTodo(todo.id, {
            title: editText.trim(),
            dueDate: editDate || null,
            dueTime: editTime || null,
            categoryId: editCategoryId,
        })
        setIsEditing(false)
    }

    // 날짜 토글 — 끄면 시간도 같이 초기화 (시간은 날짜 없이 단독 존재 불가)
    // 켤 때는 기존 마감일 있으면 그 날짜로, 없으면 오늘 날짜로 초기화
    const handleDateToggle = () => {
        if (editDate) {
            setEditDate('')
            setEditTime('')
        } else {
            setEditDate(todo.dueDate || new Date().toISOString().slice(0, 10))
        }
    }

    // 시간 토글 — 끄면 초기화, 켤 때는 기존 시간 있으면 복원 없으면 기본값 09:00
    // todo.dueTime || '' 로 하면 빈 문자열이 falsy라 토글이 켜지지 않으므로 기본값 필요
    const handleTimeToggle = () => {
        setEditTime(editTime ? '' : todo.dueTime || '09:00')
    }

    // 기한 초과 여부 (완료 항목 제외, 하루종일은 오늘 기준 초과 아님)
    const isOverdue = checkIsOverdue(todo);
    // 오늘 마감 여부 — 노란 배경 강조 및 카테고리 배지 배경색 결정에 사용 (완료 제외)
    const isDueToday = !todo.done && todo.dueDate === getTodayString();

    return (
        // 편집 모드일 땐 items-start로 전환 — 편집 폼이 세로로 길어져도 체크박스가 상단에 고정됨
        <div className={`flex gap-3 p-3 rounded-lg border hover:shadow-md transition-shadow ${isEditing ? 'items-start' : 'items-center'} ${isDueToday ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>

            {/* 체크박스: 클릭하면 done 상태 토글 */}
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 accent-blue-600 cursor-pointer mt-0.5"
            />

            {/* 편집 모드 여부에 따라 편집 폼 또는 표시 영역 렌더링 */}
            {isEditing ? (
                // 편집 모드: onBlur를 컨테이너에 달아 외부 클릭 시 저장 처리
                <div ref={editContainerRef} onBlur={handleEditBlur} className="flex-1 flex flex-col gap-2">

                    {/* 제목 수정 input */}
                    <input
                        type='text'
                        value={editText}
                        autoFocus
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirm()
                            if (e.key === 'Escape') setIsEditing(false)
                        }}
                        className='outline-none border-b border-blue-400 text-gray-800 w-full pb-0.5'
                    />

                    {/* 날짜 / 시간 토글 — !!editDate로 truthy 변환해 Toggle enabled prop에 전달 */}
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <Toggle enabled={!!editDate} onToggle={handleDateToggle} />
                            <span className="text-xs text-gray-500">날짜</span>
                            {editDate && (
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="w-36 text-xs border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                                />
                            )}
                        </div>
                        {/* 날짜가 켜져 있을 때만 시간 토글 노출 */}
                        {editDate && (
                            <div className="flex items-center gap-2">
                                <Toggle enabled={!!editTime} onToggle={handleTimeToggle} />
                                <span className="text-xs text-gray-500">시간</span>
                                {editTime && (
                                    <input
                                        type="time"
                                        value={editTime}
                                        onChange={(e) => setEditTime(e.target.value)}
                                        className="w-36 text-xs border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* 카테고리 선택 — 등록된 카테고리가 있을 때만 표시 */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {categories.map((cat) => (
                                // 선택된 카테고리 재클릭 시 선택 해제 (null로 초기화)
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setEditCategoryId(editCategoryId === cat.id ? null : cat.id)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-colors ${
                                        editCategoryId === cat.id
                                            ? 'text-white border-transparent'
                                            : 'text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    style={editCategoryId === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 저장 / 취소 버튼 — 우측 하단 정렬 */}
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">취소</button>
                        <button onClick={handleConfirm} className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">저장</button>
                    </div>

                </div>
            ) : (
                // 일반 모드: 제목 더블클릭 시 편집 모드 진입
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 카테고리 배지 — 노란 배경(오늘 마감)일 땐 흰색 배경, 평상시엔 color + '18' 투명도 */}
                        {category && (
                            <span
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-sm border flex-shrink-0"
                                style={{ color: category.color, borderColor: category.color, backgroundColor: isDueToday ? '#ffffff' : category.color + '18' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                                {category.name}
                            </span>
                        )}
                        <span
                            onDoubleClick={handleDoubleClick}
                            className={`cursor-pointer ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}
                        >{todo.title}
                        </span>
                    </div>
                    {/* 마감일이 있을 때만 표시 — 기한 초과 시 경고 아이콘 + 빨간색 */}
                    {todo.dueDate && (
                        <span className={`text-xs mt-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                            {isOverdue ? '⚠ ' : ''}{todo.dueDate}{todo.dueTime ? ` ${todo.dueTime}` : ' 하루종일'}
                        </span>
                    )}
                </div>
            )}

            {/* 삭제 버튼 */}
            <button
                onClick={() => { if (window.confirm('할 일을 삭제할까요?')) deleteTodo(todo.id); }}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0">
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
