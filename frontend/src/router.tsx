import { createBrowserRouter } from 'react-router-dom'
import { Root } from '@/screens/Root'
import { Dashboard } from '@/screens/Dashboard'
import { Users } from '@/screens/Users'
import { Posts } from '@/screens/Posts'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'posts', element: <Posts /> },
    ],
  },
])
