import React from 'react'
import { useState } from 'react';
import IKImageWrapper from './IKImageWrapper'
import SearchBar from './SearchBar';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/authContext/userAuthContext';

// Update Navbar.jsx to accept onSearch prop
const Navbar = () => {

    // const { setQuery } = useSearch(); //แชร์ state search query ระหว่าง Navbar และ HomePage (อย่าลืมลบ prop ออกถ้าใช้)
    const [searchParams] = useSearchParams();
    const query = searchParams.get("search") || "";

    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    const [open, setOpen] = useState(false); // For more info and mobile menu icon
    const { currentUser } = useAuth();
    console.log("urlEndpoint:", urlEndpoint);
    console.log("currentUser", currentUser);

    return (

        <div className='w-full h-15 md:h-20 flex items-center justify-between'>
            {/* LOGO */}
            <Link to="/" className='flex items-center gap-4 text-base font-bold'>
                {/* <IKImage urlEndpoint={urlEndpoint} path='\logo.png' className='w-12 h-12' alt='PW Logo'/> */}
                <IKImageWrapper src='logo.png' className='w-10 h-10' alt='PW Logo' />
                <span>PW Blog</span>
            </Link>

            {/* MOBILE MENU */}
            <div className='md:hidden'>
                <div className='cursor-pointer text-4xl'
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {open ? "X" : "☰"}
                </div>
                {/* MOBILE LINK LIST */}
                <div className={`w-full h-screen flex flex-col items-center justify-center absolute gap-8 font-medium text-lg top-16 transition-all ease-in-out ${open ? "-right-0 bg-slate-200" : "-right-[100%]"}`}>
                    <Link to="/">Home</Link>
                    <Link to="/write">Write</Link>
                    <Link to="/">About</Link>
                    <Link to="/">
                        <button className='py-2 px-4 rounded-3xl bg-cyan-500 text-white'>Login</button>
                    </Link>
                </div>
            </div>
            {/* DESKTOP MENU */}
            <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium text-sm'>
                <Link to="/" className='hover:text-cyan-500 duration-200'>Home</Link>
                <Link to="/write" className='hover:text-cyan-500 duration-200'>Write</Link>
                <Link to="/" className='hover:text-cyan-500 duration-200'>About</Link>

                {/* SEARCH BAR */}
                <SearchBar onSearch={query} />

                {currentUser ? (

                    <Link to={`/profile/${currentUser.uid}`}>
                        <IKImageWrapper
                            src={currentUser.photoURL || "defaultprofile.png"}
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </Link>
                ) : (
                    <Link to='/login'>
                        <button className='py-2 px-4 rounded-3xl bg-cyan-500 text-white hover:bg-cyan-600 duration-200'>Login</button>
                    </Link>
                )}

                {/* <Link to='/login'>
                    <button className='py-2 px-4 rounded-3xl bg-cyan-500 text-white hover:bg-cyan-600 duration-200'>Login</button>
                </Link> */}

            </div>
        </div>
    )
}

export default Navbar