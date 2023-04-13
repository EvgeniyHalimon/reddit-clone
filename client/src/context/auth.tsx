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
  if(token){

    console.log(/* jwt_decode(token),  */'00000')
  }
  const authProviderValues = useMemo(() => ({ token: token, setToken: setToken, user: user, setUser: setUser }), [user, token]);

  useEffect(() => {
  },[user]);

  return(
    <AuthContext.Provider
      value={authProviderValues}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default memo(AuthProvider);