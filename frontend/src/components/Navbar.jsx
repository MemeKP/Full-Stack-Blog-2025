import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full h-16 md:h-20 flex items-center'>
        {/* LOGO */}
        <div className=''>
            <img src='\logo.png' className='w-12 h-12' alt=''/>
            <span>Title</span>
        </div>
        {/* MOBILE MENU */}
        <div className='md:hidden'>M</div>
        {/* DESKTOP MENU */}
        <div className='hidden md:flex'>D</div>
    </div>
  )
}

export default Navbar