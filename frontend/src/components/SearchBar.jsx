import React, { useRef, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// use onSearch to pass query up to NavBar
const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { query, setQuery } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams()
  const [localQuery, setLocalQuery] = useState(searchParams.get("search") || "");
  const navigate = useNavigate()
  const location = useLocation()
  const debounceTimeoutRef = useRef(null)

  const query = searchParams.get('search') || ''
  // const [query, setLocalQuery] = useState('');
  // คลิกข้างนอกเพื่อปิดต้องใช้ event listener ที่ฟัง click ทั้งหน้าเว็บ และตรวจสอบว่า click นั้นอยู่นอก <div> ของ SearchBar ไหม
  const closeRef = useRef(null); //ใช้ useRef() เพื่ออ้างถึง <div> ที่ครอบ SearchBar
  // console.log(query); // test live filter through all data

  // const handleSearch = (e) => {
  //   setSearchParams({ search: e.target.value });
  //   // onSearch(e.target.value); // here
  // }

  useEffect(() => {
    // Cleanup debounce เมื่อ component unmount
    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Debounce อัปเดต query string ทุก 3 วินาทีหลังจากหยุดพิมพ์
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (localQuery.trim()) {
        if (location.pathname === "/posts") {
          setSearchParams({ search: localQuery.trim() });
        } else {
          navigate(`/posts?search=${localQuery.trim()}`);
        }
      } else {
        setSearchParams({});
      }
    }, 3000); // 3 วิ
  }, [localQuery]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const clearSearch = (e) => {
    e.stopPropagation(); // stopPropagation ป้องกันไม่ให้ click ทำให้ toggle เปิด
    setLocalQuery('')
    setSearchParams({});
    // onSearch('');
  }

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     const query = e.target.value;
  //     if (location.pathname === '/posts') {
  //       setSearchParams({...Object.fromEntries(searchParams), search: query})
  //     } else {
  //       navigate(`/posts?search=${query}`)
  //     }
  //   }
  // }
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(debounceTimeoutRef.current);
      if (localQuery.trim()) {
        navigate(`/posts?search=${localQuery.trim()}`);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (closeRef.current && !closeRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form>
      <div
        ref={closeRef}
        className={`cursor-pointer hover:bg-gray-200 items-center border rounded-full transition-all p-2 inline-flex overflow-hidden ${isOpen ? "w-64" : "w-9 h-9 bg-gray-100 justify-center"} shadow-sm`}
        onClick={() => setIsOpen(true)}
      >
        <CiSearch className="text-gray-500 text-lg" />
        {isOpen && (
          <>
            <input
              type="search"
              value={localQuery}
              onChange={handleChange}
              placeholder="Search..."
              onKeyDown={handleKeyPress}
              className="ml-1 outline-none w-full bg-transparent"
              autoFocus
            />

            {query && (
              <RxCross2
                onClick={clearSearch}
                className='text-gray-400 cursor-pointer text-xl hover:text-gray-500'
              />
            )}
          </>
        )}
      </div>
    </form>
  )
}

export default SearchBar