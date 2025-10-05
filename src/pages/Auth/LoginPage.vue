<template>
  <div class="login-wrapper">
    <q-card class="w-full max-w-sm q-pa-lg shadow-2 rounded-2xl">
      <div class="text-center q-mb-lg">
        <div class="text-h5 text-primary q-mb-xs">MileApp Test</div>
        <div class="text-caption text-grey">Login to continue</div>
      </div>

      <q-form @submit.prevent="onLogin">
        <q-input
          filled
          v-model="username"
          label="Username"
          type="text"
          :disable="loading"
          class="q-mb-md"
          autofocus
          lazy-rules
          :rules="[val => !!val || 'Username is required']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          filled
          v-model="password"
          label="Password"
          type="password"
          :disable="loading"
          class="q-mb-md"
          lazy-rules
          :rules="[val => !!val || 'Password is required']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>

        <q-btn
          color="primary"
          label="Login"
          type="submit"
          unelevated
          class="full-width q-mt-md"
          :loading="loading"
        />

        <div class="text-center text-caption text-grey q-mt-md">
          © {{ new Date().getFullYear() }} Hardeey System
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from 'src/libraries/api'
import { showError, showSuccess } from 'src/libraries/helper.js'

const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)

const onLogin = async () => {
  if (!username.value || !password.value) return

  loading.value = true
  try {
    const res = await login({
      username: username.value,
      password: password.value
    })

    if (res?.success) {
      const token = res?.data?.token
      const user = res?.data

      localStorage.setItem('access_token', token)
      localStorage.setItem('user', JSON.stringify(user))

      showSuccess(`Welcome back, ${user?.name || 'User'}!`)

      await router.push({ path: '/task' })
    } else {
      throw new Error(res?.message || 'Login failed')
    }
  } catch (err) {
    showError(err.message || 'Invalid credentials')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
}

.full-width {
  width: 100%;
}
</style>
