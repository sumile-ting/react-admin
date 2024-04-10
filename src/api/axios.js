import axios from "axios";
import { getToken } from "@/utils/auth";
const request = axios.create({
  baseURL: '/api', // 设置统一的请求前缀
  timeout: 10000, // 设置统一的超时时长
  validateStatus: (status) => {
    return status >= 200 && status <= 500;
  }
})
request.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
  if(getToken()) {
    config.headers['Spang-Auth'] = getToken();
  }
  return config
}, error => {
  return Promise.reject(error)
})
request.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default request