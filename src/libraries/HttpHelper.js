import axios from 'axios'
import { Notify } from 'quasar'

const baseURL = process.env.API_URL || 'http://127.0.0.1:8000/api/'

const http = axios.create({
  baseURL,
  timeout: 10000,
})


http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function handleError(error) {
  const status = error?.response?.status
  const message = error?.response?.data?.message || 'Terjadi kesalahan pada server'

  if (status === 401) {
    Notify.create({
      type: 'negative',
      message: 'Sesi kamu habis, silakan login ulang',
      timeout: 2000
    })
    localStorage.removeItem('access_token')
    window.location.href = '/auth/login'
    return Promise.reject('Unauthorized')
  }

  Notify.create({
    type: 'negative',
    message: message,
    timeout: 2500
  })

  return Promise.reject(error)
}

export async function get(url, params = {}) {
  try {
    const response = await http.get(url, { params })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export async function post(url, data = {}) {
  try {
    const response = await http.post(url, data)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export async function put(url, data = {}) {
  try {
    const response = await http.put(url, data)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export async function del(url) {
  try {
    const response = await http.delete(url)
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

export default {
  get,
  post,
  put,
  del
}
