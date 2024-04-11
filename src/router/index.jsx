import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react';
import Layout from '@/Layout';
import AuthRoute from './AuthRoute';
import NotFound from '@/views/NotFound';

const Login = lazy(() => import('@/views/Login'));
const Notice = lazy(() => import('@/views/Notice'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/desk',
    element: (
      <AuthRoute>
        <Layout />
      </AuthRoute>
    ),
    children: [
      {
        path: 'notice',
        element: <Notice />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router