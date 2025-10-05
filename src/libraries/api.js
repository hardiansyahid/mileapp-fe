import { get, post, put, del } from './HttpHelper'

//Auth
export function login(params) {
  return post('auth/login', params)
}

export function logout() {
  return post('auth/logout')
}

//Task
export function getTaskList(params) {
  return get('task/list', params)
}

export function retrieveTask(id) {
  return get(`task/${id}`)
}

export function createTask(params) {
  return post('task/add', params)
}

export function updateTask(id, params) {
  return put(`task/update/${id}`, params)
}

export function deleteTask(id) {
  return del(`task/delete/${id}`)
}
