import axios from "axios";
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from "./tokensWorkshop";
import { BASE_URL, REFRESH } from "../constants/backendConstants";

const accessToken = getAccessToken();
const refreshToken = getRefreshToken();
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`, 
  },
});

export const get = (url: string,data?: any): Promise<any> => {
  return axiosInstance.get(`${url}`, data);
};
    
export const post = (url: string, data: any, headers?: any): Promise<any> => {
  return axiosInstance.post(`${url}`, data, {headers : headers});
};
    
export const put = (url: string, data: any): Promise<any> => {
  return axiosInstance.put(`${url}`, data);
};
    
export const deleteData = (url: string, data?: any): Promise<any> => {
  return axiosInstance.delete(`${url}`, data);
};

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;
    axiosInstance.defaults.headers['Authorization'] =  `Bearer ${refreshToken}`;
    if (err.response.status === 403 && err.response) {
      try {
        const response = await get(REFRESH);
        if (response?.status === 200) {
          saveTokens(response.data);
          return axiosInstance({
            ...originalRequest,
            headers: { ...originalRequest.headers, Authorization: `Bearer ${response.data.accessToken}` },
          });
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          removeTokens();
          return error.response.data;
        }
        return error.response.data;
      }
    }
    return err.response.data;
  },
);