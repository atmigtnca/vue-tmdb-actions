<script setup>
import { ref } from 'vue'

const apiKey = ref('')
const movies = ref([])
const status = ref('TMDB API Key를 입력하고 Connect를 누르세요.')
const loading = ref(false)

async function connect() {
  const key = apiKey.value.trim()
  if (!key) {
    status.value = 'API Key를 입력하세요.'
    return
  }
  loading.value = true
  status.value = '불러오는 중...'
  try {
    // v3 API key는 query로, v4 Read Access Token(긴 JWT)은 Bearer 헤더로 보낸다.
    const isBearer = key.length > 60
    const url = 'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1' + (isBearer ? '' : `&api_key=${encodeURIComponent(key)}`)
    const res = await fetch(url, isBearer ? { headers: { Authorization: `Bearer ${key}` } } : undefined)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    movies.value = data.results || []
    status.value = `인기 영화 ${movies.value.length}편`
  } catch (e) {
    movies.value = []
    status.value = `불러오지 못했습니다 (${e.message}). API Key를 확인하세요.`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="wrap">
    <header>
      <h1>🎬 TMDB 인기 영화</h1>
      <p class="sub">Vue + TMDB API · 202513715 서종호</p>
      <form class="connect" @submit.prevent="connect">
        <input v-model="apiKey" type="password" placeholder="TMDB API Key" autocomplete="off" />
        <button :disabled="loading">Connect</button>
      </form>
      <p class="status">{{ status }}</p>
    </header>

    <section class="grid">
      <article v-for="m in movies" :key="m.id" class="card">
        <img v-if="m.poster_path" :src="`https://image.tmdb.org/t/p/w342${m.poster_path}`" :alt="m.title" loading="lazy" />
        <div class="info">
          <h2>{{ m.title }}</h2>
          <p class="meta">⭐ {{ m.vote_average?.toFixed(1) }} · {{ m.release_date }}</p>
          <p class="overview">{{ m.overview || '줄거리 정보가 없습니다.' }}</p>
        </div>
      </article>
    </section>
  </main>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; background: #0f1419; color: #e8eaed; font-family: system-ui, -apple-system, 'Apple SD Gothic Neo', sans-serif; }
.wrap { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
h1 { margin: 0; font-size: 28px; }
.sub { color: #9aa0a6; margin: 6px 0 20px; }
.connect { display: flex; gap: 8px; }
.connect input { flex: 1; padding: 10px 12px; border-radius: 8px; border: 1px solid #3c4043; background: #1a1f24; color: inherit; }
.connect button { padding: 10px 18px; border: 0; border-radius: 8px; background: #01b4e4; color: #0f1419; font-weight: 700; cursor: pointer; }
.connect button:disabled { opacity: .5; }
.status { color: #9aa0a6; font-size: 14px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
.card { background: #1a1f24; border-radius: 10px; overflow: hidden; }
.card img { width: 100%; display: block; aspect-ratio: 2/3; object-fit: cover; }
.info { padding: 10px 12px 14px; }
.info h2 { font-size: 16px; margin: 0 0 4px; }
.meta { color: #9aa0a6; font-size: 13px; margin: 0 0 6px; }
.overview { font-size: 13px; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
</style>
