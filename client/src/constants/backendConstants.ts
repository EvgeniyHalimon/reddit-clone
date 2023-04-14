export const BASE_URL = 'http://localhost:5000/api/'

enum Routes {
    auth = '/auth',
    users = '/users',
    password = '/password'
}

//auth

export const LOGIN = `${Routes.auth}/login`;
export const REGISTER = `${Routes.auth}/register`;
export const REFRESH = `${Routes.auth}/refresh`;
const GET_POST = ''
const GET_ALL_POSTS = ''

//GET SSPROPS CONSTANTS

export const SSR_TOP_SUBS = `${BASE_URL}misc/top-subs`
