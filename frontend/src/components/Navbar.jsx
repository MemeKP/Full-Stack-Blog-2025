import React from 'react'
import { useState } from 'react';
import { IKImage } from 'imagekitio-react';

const Navbar = () => {
    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    const [open, setOpen] = useState(false); // For more info and mobile menu icon
  
    console.log("urlEndpoint:", urlEndpoint); // ตรวจตรงนี้ด้วย

    return (
    
    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
        {/* LOGO */}
        <div className='flex items-center gap-4 text-2xl font-bold'>
            {/* <Image path='logo.png 'alt="PW Logo" w={32} h={32} /> */}
            <IKImage urlEndpoint={urlEndpoint} path='\logo.png' className='w-12 h-12' alt='PW Logo'/>
            
            <span>Title</span>
        </div>
        {/* MOBILE MENU */}
        <div className='md:hidden'>
            <div className='cursor-pointer text-4xl' 
            onClick={()=>setOpen((prev) => !prev)}
            >
                {open ? "X" : "☰"}
            </div>
            {/* MOBILE LINK LIST */}
            <div className={`w-full h-screen flex flex-col items-center justify-center absolute gap-8 font-medium text-lg top-16 transition-all ease-in-out ${open ? "-right-0" : "-right-[100%]"}`}>
            <a href='/'>Home</a>
            <a href='/'>Trending</a>
            <a href='/'>Popular</a>
            <a href='/'>About</a>
            <a href='/'>
                <button className='py-2 px-4 rounded-3xl bg-cyan-500 text-white'>Login</button>
            </a>
            </div>
        </div>
        {/* DESKTOP MENU */}
        <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium'>
            <a href='/'>Home</a>
            <a href='/'>Trending</a>
            <a href='/'>Popular</a>
            <a href='/'>About</a>
            <a href='/'>
                <button className='py-2 px-4 rounded-3xl bg-cyan-500 text-white'>Login</button>
            </a>
        </div>
    </div>
  )
}

export default Navbar