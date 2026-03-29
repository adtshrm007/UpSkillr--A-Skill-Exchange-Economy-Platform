import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth.context.jsx";
import { ToastProvider } from "./context/Toast.context.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUp from "./pages/SignUp.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PublicProfilePage from "./pages/PublicProfilePage.jsx";
import TopMatchesAndSearches from "./pages/TopMatchesAndSearches.jsx";
import SessionsPage from "./pages/SessionsPage.jsx";

import NotificationsPage from "./pages/NotificationsPage.jsx";
import CreditsPage from "./pages/CreditsPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LearningRoom from "./pages/LearningRoom.jsx";
import CourseCreatorDashboard from "./pages/CourseCreatorDashboard.jsx";

import { TopTeachers } from "./pages/TopTeachers.jsx";

import { useSocket } from "./hooks/useSocket.js";
import { useToast } from "./context/Toast.context.jsx";
import { useEffect } from "react";

function GlobalNotificationListener() {
  const { on } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    return on("new_notification", (data) => {
      toast({ message: `Notification: ${data.message || ""}`, type: "info" });
    });
  }, [on, toast]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalNotificationListener />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <PublicProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:id"
              element={
                <ProtectedRoute>
                  <LearningRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <TopMatchesAndSearches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TopMatchesAndSearches"
              element={
                <ProtectedRoute>
                  <TopMatchesAndSearches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentors"
              element={
                <ProtectedRoute>
                  <TopTeachers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credits"
              element={
                <ProtectedRoute>
                  <CreditsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator"
              element={
                <ProtectedRoute>
                  <CourseCreatorDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
