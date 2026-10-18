import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// GitHub Pages 프로젝트 사이트는 /<레포이름>/ 하위 경로에서 서비스되므로 base를 맞춘다.
export default defineConfig({
  plugins: [vue()],
  base: process.env.BASE_PATH || '/vue-tmdb-actions/',
})
