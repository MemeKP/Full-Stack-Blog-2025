import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    return (
    <form>
      <div 
        className={`hover:bg-gray-200 flex items-center border rounded-full transition-all p-2 inline-flex overflow-hidden ${isOpen ? "w-64 transition-all ease-in-out duration-300" : "w-10 bg-gray-100 justify-center"} shadow-sm`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <CiSearch className="text-gray-500 text-xl" />
        {isOpen && (
        <input 
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="ml-1 outline-none w-full bg-transparent"
          autoFocus
          />
        )}
      </div>
    </form>
  )
}

export default SearchBar