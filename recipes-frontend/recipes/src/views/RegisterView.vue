<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <router-link to="/login">Already have an account? Login</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')

    const handleRegister = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed')
        }

        // Redirect to login page
        router.push('/login')
      } catch (err: any) {
        error.value = err.message
      }
    }

    return {
      email,
      password,
      error,
      handleRegister,
    }
  },
})
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
