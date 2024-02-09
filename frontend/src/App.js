// import router
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import views
import Login from './views/login/Login'
import Main from './views/main/Main'
import Register from './views/register/Register'
import CheckLoginUser from './CheckLoginUser'

import './shared/global.scss'
import Profile from './views/profile/Profile'

const router = createBrowserRouter([
  {
    element: <CheckLoginUser />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
])

export default function App() {
  // provide router
  return <RouterProvider router={router} />
}
