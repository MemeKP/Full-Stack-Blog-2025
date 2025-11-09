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
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import SinglePostPage from './routes/SinglePostPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { AuthProvider } from './context/authContext/userAuthContext.jsx'
import ProfilePage from './routes/ProfilePage.jsx'
import { SearchProvider } from './context/SearchContext.jsx' 
import About from './routes/About.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/posts/:blog_id", // เพิ่มเข้ามาให้รองรับจากหน้า /posts
        element: <SinglePostPage/>,
      },
      {
        path: "/:blog_id", // อันนี้กรณีจากหน้า Home
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
       <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
    </AuthProvider>
  
  </StrictMode>,
)
