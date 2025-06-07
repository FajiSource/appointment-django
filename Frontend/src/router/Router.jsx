
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ClientRegisterPage from "../pages/Register/ClientRegisterPage";

import DashboardPage from "../pages/DashboardPage";
import UserPage from "../pages/UserPage";
import MemberPage from "../pages/MemberPage";
import LoansPage from "../pages/LoansPage";
import ReportsPage from "../pages/ReportsPage";
import BackupPage from "../pages/BackupPage";
import RestorePage from "../pages/RestorePage";


const getUser = () => {
  return {
    isAuthenticated: !!localStorage.getItem("authToken"),
  };
};

const AuthRedirect = () => {
  const user = getUser();
  return user.isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicRoute = ({ element }) => {
  const user = getUser();
  return user.isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

const ProtectedRoute = () => {
  const user = getUser();
  return user.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: <PublicRoute element={<LoginPage />} />,
  },
  {
    path: "/register",
    element: <PublicRoute element={<ClientRegisterPage />} />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/user",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <UserPage />,
      },
    ],
  },
  {
    path: "/member",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <MemberPage />,
      },
    ],
  },
  {
    path: "/loans",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <LoansPage />,
      },
    ],
  },
  {
    path: "/reportgen",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: "/backup",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <BackupPage />,
      },
    ],
  },
  {
    path: "/restore",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <RestorePage />,
      },
    ],
  },
]);

export default router;
