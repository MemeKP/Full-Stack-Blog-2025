import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  return (
    <div className='px-4 md:px-8 lg:px-16 lx:px-32 sxl:px-64'>
      <Toaster position='top-center' />
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout