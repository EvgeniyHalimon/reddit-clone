export interface ITokens{
    accessToken: string,
    refreshToken: string
}

export interface IAuthLogin{
    username: string,
    password: string,
}

export interface IAuthRegister extends IAuthLogin{
    email: string
}