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
    /* TODO 1: Todo 인라인 편집(수정 기능)
        1.TodoItem에서 텍스트 영역을 더블클릭 시 편집모드로 전환되게
        2. 텍스트가 필드로 바뀌고, 기존 내용이 채워진 채 포커스 받게
        3. Enter키 누르거나, input에서 포커스 벗어나면(onBlur) 수정 확정되게
        4. Esc키 누르면 수정 취소 후 원래 텍스트로 돌아가게
        5. 빈 문자열로 수정하면 수정되지 않고 원래 텍스트 유지
        ------------------------------------------------------------------
        + Hint
             - TodoItem 내부에 isEditing 상태(useState)를 추가
             - isEditing이 true이면 <input>을, false이면 <span>을 렌더링
             - todoStore에 updateTodo(id, newTitle) 액션을 추가
             - <input>에 autoFocus 속성을 추가하면 편집 모드 진입 시 자동으로
     */

    /* TODO 2: 완료 항목 구분 표시
        1. 체크박스를 클릭하면 해당 항목의 done 상태가 토글 (이미 구현 여부 확인 필요)
        2. done이 true인 항목은 텍스트에 취소선(line-through)이 적용
        3. done이 true인 항목은 텍스트 색이 연하게(text-gray-400) 표시
        4. 미완료 항목이 먼저 표시되고, 완료 항목은 구분선 아래에 표시
        5. 구분선 옆에 '완료된 항목 n개' 텍스트 표시
        ------------------------------------------------------------------
        + Hint
            - todos.filter(t => !t.done)으로 미완료 목록, filter(t => t.done)으로 완료 목록을 분리
            - Tailwind의 조건부 클래스:className={`${to do.done ? 'line-through text-gray-400' : ''}`}
            - todoStore에 toggleTodo(id) 액션을 추가
    */

    /* TODO 3: 남은 할 일 카운트 표시
        1. 페이지 상단 제목 옆에 미완료 항목 수 배지 형태로 표시
        2. 할 일을 추가하거나 완료 상태를 변경하면 카운트가 즉시 반영
        3. 미완료 항목이 0개이면 배지가 표시되지 않거나 '모두 완료!' 텍스트 표시
        ------------------------------------------------------------------
        + Hint
            - useMemo를 사용하여 완료되지 않은 항목 수를 계산
            - 예: const pendingCount = useMemo(() => todos.filter(t => !t.done).length, [todos])
            - Tailwind 배지 예시: <span className='bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full'>
     */
    }));

export default useTodoStore;