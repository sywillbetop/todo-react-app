/**
 *  유틸성 공통 사용 함수 분리
 *  - 날짜 문자열 반환
 *  - 오늘 날짜 문자열 반환
 *  - 할 일 기한 초과 여부 반환
 *  - 할 일 시간순 정렬 (달력 인라인 리스트)
 *  -
  */

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (sv-SE 로케일 = ISO 형식)
export function toDateString(date) {
    return date.toLocaleDateString('sv-SE');
}

// 오늘 날짜 문자열 반환 ('YYYY-MM-DD')
export function getTodayString() {
    return new Date().toISOString().slice(0, 10);
}

// 현재 시각 문자열 반환 ('HH:MM')
export function getCurrentTimeString() {
    return new Date().toTimeString().slice(0, 5);
}

// 할 일의 기한 초과 여부 반환
// 하루종일(dueTime 없음)인 경우 오늘은 초과로 보지 않음
export function checkIsOverdue(todo) {
    if (todo.done || !todo.dueDate) return false;
    const today = getTodayString();
    const currentTime = getCurrentTimeString();
    return (
        todo.dueDate < today ||
        (todo.dueDate === today && todo.dueTime && todo.dueTime < currentTime)
    );
}

// 시간순 정렬 — 하루종일(dueTime 없음)은 맨 앞, 이후 시간 오름차순
export function sortTodosByTime(todos) {
    return [...todos].sort((a, b) => {
        if (!a.dueTime && !b.dueTime) return 0;
        if (!a.dueTime) return -1;
        if (!b.dueTime) return 1;
        return a.dueTime.localeCompare(b.dueTime);
    });
}

// 미완료 할 일 정렬
// 1. 오늘 마감 + 기한 미초과 (시간 오름차순, 하루종일은 그룹 내 맨 뒤)
// 2. 오늘 마감 + 기한 초과 (시간 오름차순)
// 3. 나머지 (마감일 오름차순, 마감일 없는 건 맨 뒤)
export function sortPendingTodos(todos) {
    const today = getTodayString();
    return [...todos].sort((a, b) => {
        const aToday = a.dueDate === today;
        const bToday = b.dueDate === today;
        const aOverdue = checkIsOverdue(a);
        const bOverdue = checkIsOverdue(b);

        // 오늘 미초과 > 오늘 초과 > 나머지 순으로 그룹 우선순위 계산
        const rank = (todo, isToday, isOverdue) => {
            if (isToday && !isOverdue) return 0;
            if (isToday && isOverdue) return 1;
            return 2;
        };
        const rankDiff = rank(a, aToday, aOverdue) - rank(b, bToday, bOverdue);
        if (rankDiff !== 0) return rankDiff;

        // 같은 그룹 내 시간 오름차순 (하루종일은 맨 뒤)
        if (aToday && bToday) {
            if (!a.dueTime && !b.dueTime) return 0;
            if (!a.dueTime) return 1;
            if (!b.dueTime) return -1;
            return a.dueTime.localeCompare(b.dueTime);
        }

        // 나머지: 마감일 오름차순, 마감일 없는 건 맨 뒤
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    });
}
