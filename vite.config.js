// Vite 설정 파일
// Vite가 프로젝트를 어떻게 빌드하고 실행할지 설정

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // React를 Vite에서 쓸 수 있게 해줌
import tailwindcss from '@tailwindcss/vite' //Tailwind CSS를 Vite에서 쓸 수 있게 해줌

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/todo-react-app/',
})
