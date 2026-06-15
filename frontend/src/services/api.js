import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 90000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Datasets
export const uploadDataset = (formData) =>
  api.post('/datasets', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const listDatasets = () => api.get('/datasets')
export const getDataset = (id) => api.get(`/datasets/${id}`)
export const deleteDataset = (id) => api.delete(`/datasets/${id}`)
export const previewDataset = (id, limit = 20) => api.get(`/datasets/${id}/preview?limit=${limit}`)

// Chat
export const createSession = (data) => api.post('/chat/sessions', data)
export const listSessions = () => api.get('/chat/sessions')
export const getSession = (id) => api.get(`/chat/sessions/${id}`)
export const deleteSession = (id) => api.delete(`/chat/sessions/${id}`)
export const askQuestion = (data) => api.post('/chat/ask', data)

// Analytics
export const getAnalyticsSummary = (datasetId) => api.get(`/analytics/${datasetId}/summary`)
export const getInsights = (datasetId) => api.get(`/analytics/${datasetId}/insights`)
export const getForecast = (datasetId, periods = 6) => api.get(`/analytics/${datasetId}/forecast?periods=${periods}`)

// Billing
export const getPlans = () => api.get('/billing/plans')
export const createCheckout = () => api.post('/billing/create-checkout')
export const getSubscription = () => api.get('/billing/subscription')

export default api