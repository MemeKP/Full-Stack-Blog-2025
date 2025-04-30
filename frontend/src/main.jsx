import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './routes/Homepage.jsx'
import LoginPage from './routes/LoginPage.jsx'
import PostListPage from './routes/PostListPage.jsx'
import RegisterPage from './routes/RegisterPage.jsx'
import Write from './routes/Write.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import SinglePostPage from './routes/SinglePostPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage/>,
      },
      {
        path: "/post",
        element: <PostListPage/>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
