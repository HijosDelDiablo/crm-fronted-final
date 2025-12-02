import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  isLoggedIn: null,
  setUser: () => { },
  setIsLoggedIn: () => { }
});
