// api.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Tạo một Axios instance tùy chỉnh
const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL, // Đặt URL cơ sở của bạn ở đây
  timeout: 10000, // Thời gian timeout (10 giây trong trường hợp này)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Tùy chỉnh xử lý yêu cầu trước khi gửi
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Thực hiện các tùy chỉnh trước khi gửi yêu cầu (nếu cần)
    return config;
  },
  (error) => {
    // Xử lý lỗi yêu cầu (nếu cần)
    return Promise.reject(error);
  }
);

// Tùy chỉnh xử lý phản hồi sau khi nhận được
api.interceptors.response.use(
  (response) => {
    // Xử lý phản hồi sau khi nhận được (nếu cần)
    return response;
  },
  (error) => {
    // Xử lý lỗi phản hồi (nếu cần)
    return Promise.reject(error);
  }
);

export default api;
