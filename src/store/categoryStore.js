import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CATEGORY_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#38bdf8',
    '#a855f7',
    '#ec4899',
];

const useCategoryStore = create(persist((set, get) => ({
    categories: [],

    // 카테고리 추가
    addCategory: (name, color) =>
        set((state) => ({
            categories: [...state.categories, { id: Date.now(), name, color }]
        })),

    // 카테고리 삭제
    deleteCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id)
        })),

    // 카테고리명 변경
    updateCategory: (id, name) =>
        set((state) => ({
            categories: state.categories.map((c) => c.id === id ? { ...c, name } : c)
        })),

    getCategoryById: (id) =>
        get().categories.find((c) => c.id === id) ?? null,

}), { name: 'category-storage' }));

export default useCategoryStore;
