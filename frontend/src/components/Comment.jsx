import React from "react"
import IKImageWrapper from "./IKImageWrapper"
import { Link } from "react-router-dom"
import { PiHandsClappingDuotone } from "react-icons/pi";

const Comment = ({ profile, date, content, likes }) => {
  return (
    <div className="flex flex-col py-2 border-b border-gray-200">
      
      {/* AVATAR + AUTHOR */}
      <div className="flex items-center gap-4">
        <IKImageWrapper
          src={profile.avatar}
          w='40'
          alt={profile.name}
          className='w-10 h-10 rounded-full object-cover'
        />

        <div className="font-medium">
          <Link to = '/profile' className="hover:underline">
            {profile.name}
          </Link>
          <div className="text-sm font-light text-gray-500">{date}</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {content}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex items-center gap-1 text-base text-gray-600">
        <div className="flex items-center cursor-pointer hover:text-black duration-100">
          <PiHandsClappingDuotone className="text-2xl"/>
        </div>
        <span className="pr-4">{likes}</span>
        <button className="hover:text-black duration-100 cursor-pointer">Reply</button>
      </div>
    </div>
  )
}

export default Comment