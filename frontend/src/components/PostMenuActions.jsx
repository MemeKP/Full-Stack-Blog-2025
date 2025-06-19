import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";
import { IoBookmarksOutline, IoBookmarks } from "react-icons/io5";
import { useAuth } from "../context/authContext/userAuthContext";
import { FiEdit, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios"
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'


const PostMenuActions = ({ post }) => {
    console.log("post:", post);
    const { userLoggedIn, getFirebaseToken, currentUser } = useAuth();
    const [showMenu, setShowmenu] = useState(false)
    const closeRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (closeRef.current && !closeRef.current.contains(e.target)) {
                setShowmenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    const { isPending, error, data: savedPosts } = useQuery({
        queryKey: ["savedPosts"],
        queryFn: async () => {
            const token = await getFirebaseToken()
            return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
    });

    const isSaved = savedPosts?.data?.some((p) => p === post.blog_id) || false
    const queryClient = useQueryClient()

    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = await getFirebaseToken()
            return axios.patch(`${import.meta.env.VITE_API_URL}/users/save`, {
                postId: post.blog_id,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
            toast.success(res.data); // ตัว backend ส่ง "Post saved" หรือ "Post unsaved"
        },

        onError: (error) => {
            console.error("Delete failed", error)
            toast.error(error.response?.data || "Unknown error");

        }
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = await getFirebaseToken()
            return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post.blog_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            toast.promise(
                new Promise(resolve => setTimeout(resolve, 500)),
                {
                    loading: 'Deleting...',
                    success: 'Post deleted successfully',
                    error: 'Failed to delete',
                }
            ).then(() => {
                navigate("/");
            });
        },

        onError: (error) => {
            console.error("Delete failed", error)
            toast.error(error.response?.data || "Unknown error");

        }
    })

    const handleDelete = () => {
        deleteMutation.mutate()
    }

    const handleSave = () => {
        if (!userLoggedIn) {
            return navigate("/login")
        }
        saveMutation.mutate()
    }

    return (
        <div className="flex items-center justify-center gap-6 ">
            <span className="flex items-center">
                <MdOutlineRemoveRedEye className="text-2xl text-gray-500 gap-1" />
                <span className="px-2 text-gray-600">1001</span>
            </span>
            <span className="flex items-center">
                <GoHeartFill className="text-2xl text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                <span className="px-2 text-gray-600">218</span>
            </span>
            {isPending ? (
                "Loading..."
            ) : error ? (
                "Save post fail"
            ) : (
                <span>
                    {isSaved ? (
                        <IoBookmarks
                            onClick={handleSave}
                            className="text-xl cursor-pointer hover:scale-110 transition-transform"
                        />
                    ) : (
                        <IoBookmarksOutline
                            onClick={handleSave}
                            className={'text-xl cursor-pointer hover:scale-110 transition-transform '
                            }
                        />

                    )}
                </span>
            )}

            {/* OWNER ONLY ACTION */}
            {<div ref={closeRef} className="relative">
                <FiMoreHorizontal
                    onClick={() => setShowmenu(prev => !prev)}
                    className="text-xl text-gray-600 cursor-pointer hover:rotate-90 transition-transform"
                />

                {showMenu && (
                    <div className={`
                        absolute flex flex-col z-10 w-48 bg-white border rounded-lg shadow-md
                        top-full mt-2 left-0 -translate-x-0
                        md:flex-row md:top-0 md:left-full md:ml-2 md:-translate-y-1/2 md:translate-x-0
                    `}>
                        <button
                            onClick={() => console.log("Edit")}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm duration-200"
                        >
                            <FiEdit className="text-blue-500" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
                        >
                            <FiTrash2 />
                            Delete
                        </button>
                        {/* {deleteMutation.isPending && <span className="text-xs">(in progress)</span>} */}
                    </div>
                )}
            </div>}
        </div>
    )
}

export default PostMenuActions