import { createContext, useContext, useEffect, useState } from "react";
import { checkLoggedIn } from "../utils/checkLoggedIn";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const res = await checkLoggedIn();
        setLoggedInUser(res)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLoggedInUser();
  }, []);
  return (
    <>
      <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
