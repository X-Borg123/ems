import React, { createContext, useContext } from "react";
import { authStore } from "../stores/auth.store"; // Adjust path if needed

const AuthContext = createContext(authStore);

export const AuthProvider = ({ children }) => {

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
