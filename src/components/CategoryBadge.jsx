/* 카테고리 배지 / 선택 칩 공용 컴포넌트
    --> onClick 없으면 읽기 전용 배지 (TodoItem 뷰 모드)
    --> onClick 있으면 선택 가능한 칩 (AddTodo, TodoItem 편집, TodoPage 필터)
    --> onEdit / onDelete 전달 시 호버에서 연필 아이콘 / X 아이콘 노출 (AddTodo)
    --> whiteBackground: 노란 배경 카드 위에서 배지 가시성 확보용 (isDueToday)
 */

function CategoryBadge({ cat, selected, onClick, onEdit, onDelete, whiteBackground = false, className = '' }) {
    const isChip = !!onClick;
    const dotSize = isChip ? 'w-2 h-2' : 'w-1.5 h-1.5';
    const base = `flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-colors ${className}`;

    const icons = (
        <>
            {onEdit && (
                <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="hidden group-hover:inline ml-0.5 leading-none text-gray-400 hover:text-blue-400"
                >✎</span>
            )}
            {onDelete && (
                <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="hidden group-hover:inline leading-none text-gray-400 hover:text-red-400"
                >×</span>
            )}
        </>
    );

    // 선택 배지 모드 — 선택 여부에 따라 채운 색 / 회색 테두리 스타일 전환
    if (isChip) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`group ${base} ${selected ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                style={selected ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
            >
                <span className={`${dotSize} rounded-full flex-shrink-0`} style={{ backgroundColor: cat.color }} />
                {cat.name}
                {icons}
            </button>
        );
    }

    // 읽기 전용 배지 모드 — 카테고리 색 계열 반투명 배경 (노란 배경 위에선 흰색으로 강제)
    return (
        <span
            className={`${base} flex-shrink-0`}
            style={{
                color: cat.color,
                borderColor: cat.color,
                backgroundColor: whiteBackground ? '#ffffff' : cat.color + '18',
            }}
        >
            <span className={`${dotSize} rounded-full flex-shrink-0`} style={{ backgroundColor: cat.color }} />
            {cat.name}
        </span>
    );
}

export default CategoryBadge;
