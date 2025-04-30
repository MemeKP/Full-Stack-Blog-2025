import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';

const SearchBar = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [query, setQuary] = useState("");
  return (
    <form>
      <div className={`flex items-center border rounded-full transition-all p-2 inline-flex duration-200 overflow-hidden ${isHovered ? "w-64 transition-all ease-in-out duration-300" : "w-10 bg-gray-100 justify-center"} shadow-sm hover:bg-gray-100`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            if(!query) setIsHovered(false)}}
      >
        <CiSearch className="text-gray-500 text-xl" />
        {isHovered && (
        <input 
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search..."
          className="ml-1 outline-none w-full bg-transparent"
          />
        )}
      </div>
    </form>
  )
}

export default SearchBar