<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required :disabled="isLoading" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required :disabled="isLoading" />
      </div>
      <button type="submit" :disabled="isLoading" class="login-button">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <router-link to="/register" class="register-link"> Need an account? Register </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
      if (isLoading.value) return

      error.value = ''
      isLoading.value = true

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
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
          throw new Error(data.message || 'Login failed')
        }

        // Store just the token without 'Bearer ' prefix
        localStorage.setItem('token', data.token)

        // Clear form
        email.value = ''
        password.value = ''

        // Redirect to home
        router.push('/')
      } catch (err: any) {
        error.value = err.message
        console.error('Login error:', err)
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      error,
      isLoading,
      handleLogin,
    }
  },
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

div {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  color: #666;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.login-button {
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background-color: #45a049;
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  text-align: center;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  font-size: 0.9rem;
}

.register-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #4caf50;
  text-decoration: none;
  font-size: 0.9rem;
}

.register-link:hover {
  text-decoration: underline;
}

/* Add responsive design */
@media (max-width: 480px) {
  .login {
    margin: 20px;
    padding: 15px;
  }

  input {
    padding: 8px;
  }

  .login-button {
    padding: 10px;
  }
}
</style>
