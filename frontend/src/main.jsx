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
import { AuthProvider } from './context/authContext/index.jsx'
import ProfilePage from './routes/ProfilePage.jsx'
import { SearchProvider } from './context/SearchContext.jsx' 


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
        path: "/posts",
        element: <PostListPage/>,
      },
      {
        path: "/login",
        element:  <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/profile/:userId",
        element: <ProfilePage />,
      },
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
       <AuthProvider>
       <RouterProvider router={router} />
    </AuthProvider>
    </SearchProvider>
  </StrictMode>,
)
