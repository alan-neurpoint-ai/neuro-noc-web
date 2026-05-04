import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { getAllProtectedRoutes } from "./routeConfig";

const LoginPage = lazy(() => import("../pages/Login/LoginPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-accent animate-pulse">Cargando...</div>
  </div>
);

export default function Index() {
  const protectedRoutes = getAllProtectedRoutes();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {protectedRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            >
              {route.children &&
                route.children.map((child, childIdx) => (
                  <Route
                    key={childIdx}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
