/* 할 일 추가 컴포넌트
    --> 텍스트 입력 + 날짜/시간 토글 선택 + 카테고리 선택 후 추가 버튼 또는 엔터키로 등록
 */

import { useState } from 'react';
import useTodoStore from '../store/todoStore';
import useCategoryStore, { CATEGORY_COLORS } from '../store/categoryStore';
import Toggle from './Toggle';

function AddTodo() {
    const [input, setInput] = useState('');

    // 날짜 토글 상태
    const [dateEnabled, setDateEnabled] = useState(false);
    const [dueDate, setDueDate] = useState('');

    // 시간 토글 상태 (날짜가 켜져 있어야 활성화 가능)
    const [timeEnabled, setTimeEnabled] = useState(false);
    const [dueTime, setDueTime] = useState('');

    // 카테고리 상태
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[4]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingName, setEditingName] = useState('');

    const addTodo = useTodoStore((state) => state.addTodo);
    const { categories, addCategory, deleteCategory, updateCategory } = useCategoryStore();

    // 날짜 토글 끄면 시간도 같이 초기화
    const handleDateToggle = () => {
        const next = !dateEnabled;
        setDateEnabled(next);
        if (!next) {
            setDueDate('');
            setTimeEnabled(false);
            setDueTime('');
        }
    };

    // 시간 토글 끄면 시간 초기화
    const handleTimeToggle = () => {
        const next = !timeEnabled;
        setTimeEnabled(next);
        if (!next) setDueTime('');
    };

    const handleAdd = () => {
        if (!input.trim()) return;
        addTodo(
            input.trim(),
            dateEnabled ? dueDate || null : null,
            timeEnabled ? dueTime || null : null,
            selectedCategoryId,
        );
        setInput('');
        setDateEnabled(false);
        setDueDate('');
        setTimeEnabled(false);
        setDueTime('');
        setSelectedCategoryId(null);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        addCategory(newCategoryName.trim(), newCategoryColor);
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">

            {/* 텍스트 입력 + 추가 버튼 */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
                    }}
                    placeholder="할 일을 입력하세요..."
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
                    추가
                </button>
            </div>

            {/* 날짜 / 시간 토글 영역 */}
            <div className="flex gap-4 h-10 items-center">

                {/* 날짜 토글 */}
                <div className="flex items-center gap-2">
                    <Toggle enabled={dateEnabled} onToggle={handleDateToggle} />
                    <span className="text-xs text-gray-500">날짜</span>
                    {dateEnabled && (
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-36 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                        />
                    )}
                </div>

                {/* 시간 토글 — 날짜가 켜져 있을 때만 표시 */}
                {dateEnabled && (
                    <div className="flex items-center gap-2">
                        <Toggle enabled={timeEnabled} onToggle={handleTimeToggle} />
                        <span className="text-xs text-gray-500">시간</span>
                        {timeEnabled && (
                            <input
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-36 text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                            />
                        )}
                    </div>
                )}

            </div>

            {/* 카테고리 선택 영역 */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-1">
                {categories.map((cat) => (
                    editingCategoryId === cat.id ? (
                        <input
                            key={cat.id}
                            type="text"
                            value={editingName}
                            autoFocus
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => {
                                if (editingName.trim()) updateCategory(cat.id, editingName.trim());
                                setEditingCategoryId(null);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (editingName.trim()) updateCategory(cat.id, editingName.trim());
                                    setEditingCategoryId(null);
                                }
                                if (e.key === 'Escape') setEditingCategoryId(null);
                            }}
                            className="w-20 text-xs border rounded-full px-2 py-0.5 outline-none focus:border-blue-400"
                            style={{ borderColor: cat.color }}
                        />
                    ) : (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                            className={`group flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                                selectedCategoryId === cat.id
                                    ? 'text-white border-transparent'
                                    : 'text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                            style={selectedCategoryId === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                        >
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                            <span
                                role="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategoryId(cat.id);
                                    setEditingName(cat.name);
                                }}
                                className="hidden group-hover:inline ml-0.5 leading-none text-gray-400 hover:text-blue-400"
                            >✎</span>
                            <span
                                role="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCategory(cat.id);
                                    if (selectedCategoryId === cat.id) setSelectedCategoryId(null);
                                }}
                                className="hidden group-hover:inline leading-none text-gray-400 hover:text-red-400"
                            >×</span>
                        </button>
                    )
                ))}
                {!isAddingCategory && (
                    <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
                    >+ 카테고리</button>
                )}
            </div>

            {/* 카테고리 추가 폼 */}
            {isAddingCategory && (
                <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCategory();
                            if (e.key === 'Escape') { setIsAddingCategory(false); setNewCategoryName(''); }
                        }}
                        placeholder="카테고리 이름"
                        autoFocus
                        className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-400"
                    />
                    <div className="flex gap-1">
                        {CATEGORY_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setNewCategoryColor(color)}
                                className={`w-4 h-4 rounded-full transition-transform ${newCategoryColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-300' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <button type="button" onClick={handleAddCategory} className="text-xs text-blue-600 font-medium hover:text-blue-700">추가</button>
                    <button type="button" onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }} className="text-xs text-gray-400 hover:text-gray-600">취소</button>
                </div>
            )}

        </div>
    );
}
export default AddTodo;
