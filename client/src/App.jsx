import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./pages/ProfilePage";
import TopMatchesAndSearches from "./pages/TopMatchesAndSearches";
import { DashboardProvider } from "./context/Dashboard.context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <DashboardProvider>
                <DashboardPage />
              </DashboardProvider>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardProvider>
                <Profile />
              </DashboardProvider>
            }
          />
          <Route
            path="/TopMatchesAndSearches"
            element={<TopMatchesAndSearches />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
