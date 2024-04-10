import { createBrowserRouter } from 'react-router-dom'
import Login from '@/views/Login'
import Layout from '@/Layout'
import Notice from '@/views/workspace/Notice'
import AuthRoute from './AuthRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/desk',
    element: <AuthRoute><Layout /></AuthRoute>,
    children: [
      {
        path: 'notice',
        element: <Notice />,
      }
    ]
  }
])

export default router