// 앱의 진입점 파일
// index.html의 <div id="root"> 안에 React 앱을 집어넣는 역할

import { BrowserRouter } from 'react-router' // URL 주소 기반으로 페이지를 전환해주는 라우터
import { createRoot } from 'react-dom/client' // React 앱을 HTML에 연결하는 함수
import App from './App' // 최상위 컴포넌트
import './index.css' // 전역 CSS (Tailwind 포함)



createRoot(document.getElementById('root')).render(
    // BrowserRouter로 감싸야 앱 어디서든 React Router를 쓸 수 있음
    <BrowserRouter basename="/todo-react-app">
        <App />
    </BrowserRouter>
)