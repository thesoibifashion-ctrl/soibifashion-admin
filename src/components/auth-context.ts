import { createContext, useContext } from "react";

export const AuthContext = createContext(false);
export const useAuthInitialized = () => useContext(AuthContext);
