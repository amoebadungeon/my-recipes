<template>
  <div class="app-container">
    <header class="header">
      <h1>Welcome to Recipe Collection</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <main class="main-content">
      <StoredRecipes />
      <PublicRecipes />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import StoredRecipes from '@/components/StoredRecipes.vue'
import PublicRecipes from '@/components/PublicRecipes.vue'
import '@/assets/styles/home.css'

export default defineComponent({
  name: 'HomeView',
  components: {
    StoredRecipes,
    PublicRecipes,
  },
  setup() {
    const router = useRouter()

    const handleLogout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    return {
      handleLogout,
    }
  },
})
</script>
