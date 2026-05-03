import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import {
  SuperadminPage,
  AdminPage,
  ClientPage,
  UserPage,
  LoginPage,
} from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/dashboard/super_admin"
          element={
            <ProtectedRoute>
              <SuperadminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute>
              <ClientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
