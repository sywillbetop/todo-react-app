// 유틸성 공통 사용 함수 분리

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
