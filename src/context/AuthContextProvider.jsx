import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import AuthService from "../pages/Auth/AuthService";

export const AuthContextProvider = ({ children }) => {
const [user, setUser] = useState(null);
  const [ isLoggedIn, setIsLoggedIn ] = useState(null);

 useEffect(() => {
    const unsubscribe = AuthService.subscribe((u) => {
      if (u) {
        setUser(u);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
    
    return unsubscribe;
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
