/* 앱의 메인 페이지 컴포넌트
    --> 헤더(제목 + 카운트 배지), 입력창, 미완료 목록, 완료 목록 렌더링
 */

import { useMemo, useState } from 'react'

// 현재 시간대에 따른 인사말 반환
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 0  && hour < 6)  return { sub: '늦은 새벽이네요.',           main: '할 일이 있으신가요?' };
    if (hour >= 6  && hour < 12) return { sub: '좋은 아침입니다.',           main: '오늘 하루 어떤 일들이 기다리고 있나요?' };
    if (hour >= 12 && hour < 14) return { sub: '점심식사는 맛있게 하셨나요?',   main: '오늘 오후는 무엇을 계획 중이신가요?' };
    if (hour >= 14 && hour < 18) return { sub: '바쁜 오후입니다.',           main: '오늘 할 일이 얼마나 남았나요?' };
    if (hour >= 18 && hour < 21) return { sub: '어떤 하루를 보내셨나요?',     main: '오늘 못 마친 일이 있나요?' };
    return                              { sub: '늦은 밤이네요.',            main: '오늘 하루는 어떠셨나요?' };
}

import useTodoStore from '../store/todoStore';
import useCategoryStore from '../store/categoryStore';
import { sortPendingTodos, getTodayString, checkIsOverdue } from '../utils/todoUtils';
import AddTodo from '../components/AddTodo';
import CategoryBadge from '../components/CategoryBadge';
import TodoItem from '../components/TodoItem';
import WeatherWidget from '../components/WeatherWidget';
import CalendarWidget from '../components/CalendarWidget';

function TodoPage() {
    const todos = useTodoStore((state) => state.todos);
    const categories = useCategoryStore((state) => state.categories);
    const [filterCategoryId, setFilterCategoryId] = useState(null);
    const filterCategory = categories.find((c) => c.id === filterCategoryId) ?? null;
    // 상태 필터: null | 'today' | 'important' | 'overdue' — 카테고리 필터와 독립적으로 AND 조건 적용
    const [filterStatus, setFilterStatus] = useState(null);

    // useMemo: todos가 변경될 때만 다시 계산 (불필요한 재계산 방지위함)
    const pendingTodos = useMemo(() => {
        const today = getTodayString();
        let pending = todos.filter((t) => !t.done);
        if (filterCategoryId) pending = pending.filter((t) => t.categoryId === filterCategoryId);
        // 상태 필터 적용 (카테고리 필터와 AND 조건)
        if (filterStatus === 'today')     pending = pending.filter((t) => t.dueDate === today);
        if (filterStatus === 'important') pending = pending.filter((t) => t.important);
        if (filterStatus === 'overdue')   pending = pending.filter((t) => checkIsOverdue(t));
        return sortPendingTodos(pending);
    }, [todos, filterCategoryId, filterStatus]);
    const doneTodos = useMemo(() => {
        const done = todos.filter((t) => t.done);
        return filterCategoryId ? done.filter((t) => t.categoryId === filterCategoryId) : done;
    }, [todos, filterCategoryId]);

    const pendingCount = pendingTodos.length

    return (
        // 2컬럼 레이아웃: 좌측(할 일) + 우측(위젯) 영역 완전 분리
        <div className='h-screen bg-gray-50 flex gap-6 p-6 overflow-hidden'>

            {/* ───────── 좌측: 할 일 영역 ───────── */}
            {/* flex-1으로 공간 채운 뒤, 내부 래퍼에서 max-w + mx-auto로 중앙 정렬 */}
            <div className='flex-1 min-h-0 flex flex-col'>
                <div className='max-w-2xl w-full mx-auto flex flex-col flex-1 min-h-0 gap-4'>

                    {/* 헤더 섹션 */}
                    <div className='flex-shrink-0 text-center'>
                        {getGreeting().sub && (
                            <p className='text-sm text-gray-400 mb-1'>{getGreeting().sub}</p>
                        )}
                        <div className='flex items-center justify-center gap-2'>
                            <h1 className='text-2xl font-semibold text-blue-600'>{getGreeting().main}</h1>
                            {pendingCount > 0 ? (
                                // 미완료 항목이 있으면 숫자 배지 표시 — 카테고리 필터 활성 시 해당 카테고리 색으로 표시
                                <span
                                    className='text-white text-xs px-2 py-0.5 rounded-full'
                                    style={{ backgroundColor: filterCategory ? filterCategory.color : '#2563eb' }}
                                >
                                    {pendingCount}
                                </span>
                            ) : (
                                // 필터 기준으로 미완료 0개 + 완료 1개 이상일 때 '모두 완료!' 표시
                                doneTodos.length > 0 && (
                                    <span className='text-sm text-green-500 font-medium'>모두 완료!</span>
                                )
                            )}
                        </div>
                    </div>

                    {/* 카테고리 필터 칩 */}
                    {categories.length > 0 && (
                        <div className='flex-shrink-0 flex flex-wrap gap-2 justify-center'>
                            <button
                                onClick={() => setFilterCategoryId(null)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${!filterCategoryId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >전체</button>
                            {categories.map((cat) => (
                                <CategoryBadge
                                    key={cat.id}
                                    cat={cat}
                                    selected={filterCategoryId === cat.id}
                                    onClick={() => setFilterCategoryId(filterCategoryId === cat.id ? null : cat.id)}
                                    className='px-3 py-1'
                                />
                            ))}
                        </div>
                    )}

                    {/* 입력 컴포넌트 (고정) */}
                    <div className='flex-shrink-0'>
                        <AddTodo />
                    </div>

                    {/* 상태 필터 탭 — 카테고리 칩과 구분되도록 탭 언더라인 스타일 적용 */}
                    <div className='flex-shrink-0 flex items-center gap-1 border-b border-gray-200'>
                        {[
                            { key: null,        label: '전체' },
                            { key: 'today',     label: '🗓 오늘' },
                            { key: 'important', label: '⭐ 중요' },
                            { key: 'overdue',   label: '⚠ 기한 초과' },
                        ].map(({ key, label }) => (
                            <button
                                key={String(key)}
                                onClick={() => setFilterStatus(filterStatus === key ? null : key)}
                                className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
                                    filterStatus === key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >{label}</button>
                        ))}
                        {/* 정렬 기준 안내 툴팁 — 호버 시 현재 정렬 순서 표시 */}
                        <div className='relative group ml-auto mb-px'>
                            <span className='cursor-default text-xl text-gray-500 hover:text-gray-700 transition-colors select-none leading-none'>ⓘ</span>
                            <div className='absolute right-0 bottom-full mb-2 w-48 bg-gray-800/75 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed backdrop-blur-sm'>
                                <p className='font-medium mb-1'>정렬 순서</p>
                                <p>① 오늘 마감 (시간 오름차순)</p>
                                <p>② 기한 초과</p>
                                <p>③ 나머지 (마감일 오름차순)</p>
                            </div>
                        </div>
                    </div>

                    {/* 미완료 목록 (스크롤 영역) */}
                    <div className='flex-1 min-h-0 overflow-y-auto space-y-3 pb-2'>
                        {pendingTodos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                        {todos.length === 0 && (
                            <p className='text-center text-gray-400 py-10'>등록된 할 일이 없습니다.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* ───────── 우측: 위젯 영역 ───────── */}
            <div className='w-96 flex-shrink-0 flex flex-col gap-4 min-h-0 overflow-hidden'>
                <div className='flex-shrink-0'>
                    <WeatherWidget />
                </div>
                <div className='flex-shrink-0'>
                    <CalendarWidget />
                </div>

                {/* 완료 항목 섹션 — 항상 표시 */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 flex-1 min-h-0'>
                    {/* 완료 섹션 헤더 */}
                    <div className='flex items-center gap-2 flex-shrink-0'>
                        <hr className='flex-1 border-gray-200' />
                        <span className='text-xs text-gray-400 whitespace-nowrap font-medium'>
                            완료 {doneTodos.length}개
                        </span>
                        <hr className='flex-1 border-gray-200' />
                    </div>
                    {/* 완료 항목 목록 (스크롤) */}
                    {doneTodos.length > 0 ? (
                        <div className='space-y-2 overflow-y-auto flex-1 min-h-0'>
                            {doneTodos.map((todo) => (
                                <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </div>
                    ) : (
                        <p className='text-xs text-gray-400 text-center py-2'>완료된 항목이 없습니다.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
export default TodoPage;
