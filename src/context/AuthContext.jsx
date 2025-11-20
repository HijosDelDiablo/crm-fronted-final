import  { createContext } from 'react'

export const AuthContext = createContext({
  jwtUser: null,
  setUser: () => '',
});

export default AuthContext;