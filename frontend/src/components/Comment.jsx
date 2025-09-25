import IKImageWrapper from "./IKImageWrapper"
import { Link } from "react-router-dom"
import { PiHandsClappingDuotone } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import axios from "axios"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react";
import { format } from "timeago.js"
import { useAuth } from "../context/authContext/userAuthContext";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const Comment = ({ comment, postId }) => {
  const user = comment?.comment_by;
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { getFirebaseToken } = useAuth();
  const queryClient = useQueryClient()

  useEffect(() => {
    setDeleteTarget(null);
  }, [postId]);

  const handleDelete = async (commentId) => {
    try {
      const token = await getFirebaseToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      queryClient.invalidateQueries(["comments", postId])
      setDeleteTarget(null); //ต้องปิด dialog หลังลบเสร็จด้วย ถ้า modal ไม่ปิด บาง browser มองว่าเป็น behavior เสี่ยงแล้วจะ ERR_CONNECTION_RESET
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

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
          <div className="text-sm font-light text-gray-500">{format(comment.commentedAt)}</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {comment.comment}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex items-center gap-1 text-base text-gray-600">
        <div className="flex items-center cursor-pointer hover:text-cyan-500 duration-300">
          <PiHandsClappingDuotone className="text-2xl" />
        </div>
        <span className="pr-4 text-sm">(20)</span>
        <button className="hover:text-black duration-100 cursor-pointer pr-4">
          Reply
        </button>
        <button onClick={() => setDeleteTarget(comment)}>
          <MdDelete className="text-2xl text-gray-500 hover:text-red-500 transition cursor-pointer" />
        </button>
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="">
                  <div className="">
                    <h2 className="text-lg font-semibold mb-4">Delete this comment?</h2>
                    <p className="text-gray-600 mb-6">
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setDeleteTarget(null)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await handleDelete(deleteTarget._id)
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Comment

