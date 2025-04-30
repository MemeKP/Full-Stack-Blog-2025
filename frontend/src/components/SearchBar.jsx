import React from 'react'
import { CiSearch } from "react-icons/ci";
import { useState } from 'react';

const SearchBar = () => {
    const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`flex items-center border rounded-full transition-all p-2 inline-flex duration-300 overflow-hidden ${isHovered ? "w-64 " : "justify-center"} shadow-sm hover:bg-gray-100`}
        onMouseEnter={() => setIsHovered(true)}
    >
      <CiSearch className="text-gray-500 text-xl" />
    </div>
  )
}

export default SearchBar