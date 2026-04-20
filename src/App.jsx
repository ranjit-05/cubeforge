import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TimerProvider } from "./context/TimerContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const Login      = lazy(() => import("./pages/Login"));
const Register   = lazy(() => import("./pages/Register"));
const Dashboard  = lazy(() => import("./pages/Dashboard"));
const Timer      = lazy(() => import("./pages/Timer"));
const Algorithms = lazy(() => import("./pages/Algorithms"));
const Progress   = lazy(() => import("./pages/Progress"));
const Training   = lazy(() => import("./pages/Training"));

const PageLoader = () => (
  <div className="loading-screen">
    <div className="spinner" />
  </div>
);

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">{children}</main>
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TimerProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/timer"     element={<ProtectedRoute><AppLayout><Timer /></AppLayout></ProtectedRoute>} />
              <Route path="/algorithms" element={<ProtectedRoute><AppLayout><Algorithms /></AppLayout></ProtectedRoute>} />
              <Route path="/progress"  element={<ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute>} />
              <Route path="/training"  element={<ProtectedRoute><AppLayout><Training /></AppLayout></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </TimerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
