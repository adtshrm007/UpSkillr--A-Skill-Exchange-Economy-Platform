import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth.context.jsx";
import { ToastProvider } from "./context/Toast.context.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUp from "./pages/SignUp.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TopMatchesAndSearches from "./pages/TopMatchesAndSearches.jsx";
import SessionsPage from "./pages/SessionsPage.jsx";
import SwapsPage from "./pages/SwapsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CreditsPage from "./pages/CreditsPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><TopMatchesAndSearches /></ProtectedRoute>} />
            <Route path="/TopMatchesAndSearches" element={<ProtectedRoute><TopMatchesAndSearches /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><SessionsPage /></ProtectedRoute>} />
            <Route path="/swaps" element={<ProtectedRoute><SwapsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />

            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
