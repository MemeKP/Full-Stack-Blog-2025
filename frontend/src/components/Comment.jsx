import React from "react"
import IKImageWrapper from "./IKImageWrapper"
import { Link } from "react-router-dom"
import { PiHandsClappingDuotone } from "react-icons/pi";
import axios from "axios"

const Comment = ({ comment, postId }) => { //profile, date, content, likes 
  const user = comment?.comment_by;
  // console.log("user:", user)
  // console.log("user.profile_img:", user?.profile_img)

  return (
    <div className="flex flex-col py-2 border-b border-gray-200">

      {/* AVATAR + AUTHOR */}
      <div className="flex items-center gap-4">
        <img
          src={user?.profile_img || "defaultprofile.png"}
          w="40"
          alt={user?.username}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="font-medium">
          <Link to="/profile" className="hover:underline">
            {user?.username}
          </Link>
          <div className="text-sm font-light text-gray-500">2 days ago</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {comment.comment}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex items-center gap-1 text-base text-gray-600">
        <div className="flex items-center cursor-pointer hover:text-black duration-100">
          <PiHandsClappingDuotone className="text-2xl" />
        </div>
        <span className="pr-4">"20 likes"</span>
        <button className="hover:text-black duration-100 cursor-pointer">Reply</button>
      </div>
    </div>
  );
};

export default Comment