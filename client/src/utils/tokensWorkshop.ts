import { ITokens } from '../types';

export const saveTokens = (data: ITokens) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('floppedit_accessToken', data.accessToken);
    localStorage.setItem('floppedit_refreshToken', data.refreshToken);
  }
  
};

export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('floppedit_accessToken');
    localStorage.removeItem('floppedit_refreshToken');
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('floppedit_refreshToken') ?? 'token';
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('floppedit_accessToken') ?? 'token';
  }
};