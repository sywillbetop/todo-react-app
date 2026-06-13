/* 앱의 메인 페이지 컴포넌트
    --> 헤더(제목 + 카운트 배지), 입력창, 미완료 목록, 완료 목록 렌더링
 */

import { useMemo } from 'react'
import useTodoStore from '../store/todoStore';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import WeatherWidget from '../components/WeatherWidget';

function TodoPage() {
    // 스토어에서 전체 할 일 목록을 가져
    // todos가 변경될 때마다 이 컴포넌트 자동으로 리렌더링
    const todos = useTodoStore((state) => state.todos);

    // useMemo: todos가 변경될 때만 다시 계산 (불필요한 재계산 방지위함)
    // 미완료 항목만 필터링
    const pendingTodos = useMemo(() => todos.filter((t) => !t.done), [todos])
    // 완료 항목만 필터링
    const doneTodos = useMemo(() => todos.filter((t) => t.done), [todos])

    // 미완료 항목 개수 (배지에 표시)
    const pendingCount = pendingTodos.length

    return (
        <div className='min-h-screen bg-gray-50 p-6'>

            {/* 우측 상단 고정 위치에 날씨 위젯 배치 */}
            {/* FIXME: 브라우저 창 축소 시에 날씨 위젯과 할 일 입력창 영역이 겹치는 버그 수정 필요. */}
            <div className='absolute top-6 right-6'>
                <WeatherWidget />
            </div>

            <div className='max-w-md mx-auto space-y-6'>
                {/* ───────── 헤더 섹션 ───────── */}
                <div className='flex items-center justify-center gap-2'>
                    <h1 className='text-3xl font-extrabold text-blue-600'>My Tasks</h1>

                    {pendingCount > 0 ? (
                        // 미완료 항목이 있으면 숫자 배지 표시
                        <span className='bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full'>
                            {pendingCount}
                        </span>
                    ) : (
                        // 미완료 항목이 0개이고 todos가 하나라도 있으면 '모두 완료!' 표시
                        todos.length > 0 && (
                            <span className='text-sm text-green-500 font-medium'>모두 완료!</span>
                        )
                    )}
                </div>

                {/* ───────── 입력 컴포넌트 ───────── */}
                <AddTodo />

                {/* ───────── 목록 섹션 ───────── */}
                <div className='space-y-3'>
                    {/* ───────── 미완료 항목 목록 ───────── */}
                    {pendingTodos.map((todo) => (
                        // key: React가 각 항목을 구별하기 위해 반드시 필요한 고유값
                        <TodoItem key={todo.id} todo={todo} />
                    ))}

                    {/* 완료 항목이 1개 이상일 때만 구분선 + 완료 목록 표시 */}
                    {doneTodos.length > 0 && (
                        <> {/* <div> 대신 Fragment(<></>) 사용 : <div>로 감싸면 부모의 space-y-3 간격 계산 틀어짐 방지*/}
                            {/* 구분선 + '완료된 항목 N개' 텍스트 */}
                            <div className='flex items-center gap-2 pt-2'>
                                <hr className='flex-1 border-gray-300' />
                                <span className='text-xs text-gray-400 whitespace-nowrap'>
                                    완료된 항목 {doneTodos.length}개
                                </span>
                                <hr className='flex-1 border-gray-300' />
                            </div>

                            {/* 완료 항목 목록 */}
                            {doneTodos.map((todo) => (
                                <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </>
                    )}

                    {/* todos 배열이 완전히 비어있을 때 안내 문구 */}
                    {todos.length === 0 && (
                        <p className='text-center text-gray-400 py-10'>등록된 할 일이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
export default TodoPage;