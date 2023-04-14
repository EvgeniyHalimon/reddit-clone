import { createContext, FC, ReactNode, useState, useMemo, useEffect, memo } from 'react';
import jwt_decode from "jwt-decode";
import { User } from '../types';
import { getAccessToken } from '../utils/tokensWorkshop';

interface IAuthContext{
  token: string | null,
  setToken: (value: string | null) => void,
  user: User | null,
  setUser: (value: User | null) => void
}

export const AuthContext = createContext<IAuthContext>({
  token: null,
  setToken: (user: string | null) => {},
  user: null,
  setUser: (value: User | null) => {}
});

interface IAuthProvider{
    children: ReactNode
}

const AuthProvider: FC<IAuthProvider> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getAccessToken() ? getAccessToken() : null);
  const [user, setUser] = useState<User | null>(/* () =>  jwt_decode(token) ? jwt_decode(token) :  */null);

  function parseJwt(token) {
    if(token !== 'token' && token !== null){
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }

  console.log(parseJwt(token).user, 'fkvkfvjnfjvnjfnvjnfjvnjfnvjfnvjnfjvnjfnvjnfj')
  const authProviderValues = useMemo(() => ({ token: token, setToken: setToken, user: user, setUser: setUser }), [user, token]);

  useEffect(() => {
    setUser(parseJwt(token).user)
  },[user, token]);

  return(
    <AuthContext.Provider
      value={authProviderValues}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default memo(AuthProvider);