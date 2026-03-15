import { createContext, useContext, useState, useEffect } from "react";
import { getDashboard } from "../utils/getDashboard";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await getDashboard();
        setUser(res);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <DashboardContext.Provider value={{ user, setUser }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);