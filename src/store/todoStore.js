import { create } from 'zustand';

/**
 * 1. 전역 상태 관리 (Zustand Store)
 * 모든 상태와 로직을 중앙에서 관리합니다.
 */
const useTodoStore = create((set) => ({
    todos: [],
    addTodo: (title) =>
        set((state) => ({
            todos: [...state.todos, { id: Date.now(), title, done: false }]
        })),
    toggleTodo: (id) =>
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, done: !t.done } : t
            )
        })),
    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((t) => t.id !== id)
        })),
    }));

export default useTodoStore;