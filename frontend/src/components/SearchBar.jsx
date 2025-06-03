import React, { useRef, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { useSearch } from '../context/SearchContext';

// use onSearch to pass query up to NavBar
const SearchBar = ( ) => {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery } = useSearch();
  // const [query, setLocalQuery] = useState('');
  // คลิกข้างนอกเพื่อปิดต้องใช้ event listener ที่ฟัง click ทั้งหน้าเว็บ และตรวจสอบว่า click นั้นอยู่นอก <div> ของ SearchBar ไหม
  const closeRef = useRef(null); //ใช้ useRef() เพื่ออ้างถึง <div> ที่ครอบ SearchBar
  // console.log(query); // test live filter through all data

  const handleSearch = (e) => {
    setQuery(e.target.value);
    // onSearch(e.target.value); // here
  }

  const clearSearch = (e) => {
    e.stopPropagation(); // stopPropagation ป้องกันไม่ให้ click ทำให้ toggle เปิด
    setQuery('');
    // onSearch('');
  }

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
        className={`cursor-pointer hover:bg-gray-200 items-center border rounded-full transition-all p-2 inline-flex overflow-hidden ${isOpen ? "w-64" : "w-10 bg-gray-100 justify-center"} shadow-sm`}
        onClick={() => setIsOpen(true)}
      >
        <CiSearch className="text-gray-500 text-xl" />
        {isOpen && (
          <>
            <input
              type="search"
              value={query}
              onChange={handleSearch}
              placeholder="Search..."
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