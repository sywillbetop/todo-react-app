/* 라우팅(페이지 경로) 설정 파일
   --> 어떤 URL에서 어떤 페이지 컴포넌트를 보여줄지 정의
 */

import { Routes, Route } from 'react-router'
import TodoPage from './pages/TodoPage'

function App() {
    return (
        // Routes: 경로 목록 감싸는 컨테이너
        // Route: URL경로와 보여줄 컴포넌트 연결
        // path='/' 는 기본 주소(=localhost:5173/) 의미
        <Routes>
            <Route path='/' element={<TodoPage />} />
        </Routes>
    )
}

export default App