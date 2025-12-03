import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import AuthService from "../pages/Auth/AuthService";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((u) => {
      console.log('📱 AuthContextProvider - User update:', u);
      console.log('📱 AuthContextProvider - User role:', u?.rol);
      if (u) {
        setUser(u);
        setIsLoggedIn(true);
        console.log('📱 AuthContextProvider - User logged in');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        console.log('📱 AuthContextProvider - User logged out');
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
