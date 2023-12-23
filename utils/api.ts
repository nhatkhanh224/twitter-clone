// src/utils/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const baseURL = `${process.env.API_URL}`; // Đặt baseURL của API của bạn ở đây hoặc sử dụng biến môi trường

const api: AxiosInstance = axios.create({
  baseURL,
});

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'; // Thêm các phương thức khác nếu cần

const request = async <T>(method: RequestMethod, url: string, data?: any): Promise<T> => {
  try {
    const response = await api.request<T>({
      url,
      method: method.toLowerCase() as AxiosRequestConfig['method'], // Ép kiểu cho chắc chắn
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', (error as AxiosError).message);
    throw error;
  }
};

export default request;
