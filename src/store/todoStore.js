/* Zustand 전역 상태 관리 파일
  --> 모든 컴포넌트에서 공유해야 하는 todos 데이터와 그 데이터를 변경하는 함수들을 한 곳에서 관리
 */
import { create } from 'zustand';

/**
 * 1. 전역 상태 관리 (Zustand Store)
 * 모든 상태와 로직을 중앙에서 관리합니다.
 */

// create()로 스토어 생성
// set: 상태를 업데이트할 때 사용하는 Zustand 내장 함수
const useTodoStore = create((set) => ({
    // -- State --
    todos: [], // 할 일 목록 배열 -> { id, title, done }

    // -- Action (상태 변경 함수) --
    addTodo: (title) =>
        set((state) => ({
            // 기존 todos 배열에 새 항목을 추가한 새 배열 반환
            // Date.now()로 고유ID 생성 (현재 시각 밀리초)
            todos: [...state.todos, { id: Date.now(), title, done: false }]
        })),

    // 완료 상태 토글 (체크박스 클릭 시)
    // id: 토글할 항목의 id
    toggleTodo: (id) =>
        set((state) => ({
            // map으로 전체 순회하면서 id가 일치하는 항목만 done값 반전
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, done: !t.done } : t
            )
        })),

    // 할 일 삭제
    // id: 삭제할 항목의 id
    deleteTodo: (id) =>
        set((state) => ({
            // filter로 id가 일치하지 않는 항목만 남김 (= 해당 항목 제거)
            todos: state.todos.filter((t) => t.id !== id)
        })),

    // 할 일 내용 수정 (인라인 편집)
    // id: 수정할 항목의 id
    // newTitle: 수정된 새 텍스트
    updateTodo: (id, newTitle) =>
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, title: newTitle } : t
            ),
        })),
    }));

export default useTodoStore;