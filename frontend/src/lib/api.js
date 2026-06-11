import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

export const getScenes = () => api.get('/scenes').then((r) => r.data)

export const generateMockup = (file, sceneId) => {
  const form = new FormData()
  form.append('file', file)
  form.append('scene_id', sceneId)
  return api.post('/mockups/generate', form).then((r) => r.data)
}

export const listMockups = () => api.get('/mockups?limit=50').then((r) => r.data)

export const deleteMockup = (id) => api.delete(`/mockups/${id}`)
