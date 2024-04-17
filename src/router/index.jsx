import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spin } from "antd";
import Layout from "@/Layout";
import AuthRoute from "./AuthRoute";
import NotFound from "@/views/NotFound";

const Login = lazy(() => import("@/views/Login"));
const Notice = lazy(() => import("@/views/Notice"));
const Welcome = lazy(() => import("@/views/Welcome"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to={"/index"} replace />
      },
      {
        path: "index",
        element: <Welcome />
      }
    ]
  },
  {
    path: "/desk",
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        path: "notice",
        element: (
          <Suspense fallback={<Spin fullscreen />}>
            <Notice />
          </Suspense>
        )
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
