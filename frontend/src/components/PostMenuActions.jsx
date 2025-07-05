import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoHeartFill, GoHeart } from "react-icons/go";
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
    const [ready, setReady] = useState(false) //ลองแก้ gettoken ช้า

    // แก้รอ get Token ช้า (React Query จะรอโหลด token จาก Firebase ก่อน ถึงจะค่อย query ข้อมูล like/save ได้) 
    useEffect(() => {
        // รอ auth พร้อมก่อน
        const tokenReady = async () => {
            const token = await getFirebaseToken()
            if (token) setReady(true)
        }
        tokenReady()
    }, [])

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
        enabled: ready, // เริ่ม query ได้ก็ต่อเมื่อพร้อม
        queryFn: async () => {
            const token = await getFirebaseToken()
            return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
    });

    // 1. user liked อะไรบ้าง
    const { data: likedPostsData } = useQuery({
        queryKey: ["likedPosts"],
        enabled: !!currentUser,
        queryFn: async () => {
            const token = await getFirebaseToken();
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/liked`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data; // array of blog_id
        }
    })
    useEffect(() => { }, [likedPostsData]); //กัน sync ไม่ทัน

    // 2. ใคร liked โพสต์นี้บ้าง
    const { data } = useQuery({
        queryKey: ["likedBy"], //post.blog_id
        enabled: !!currentUser,
        queryFn: async () => {
            const token = await getFirebaseToken();
            return axios.get(`${import.meta.env.VITE_API_URL}/posts/like`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
    });
    const likedPosts = data?.data || []; // array of blog_id
    const [localLiked, setLocalLiked] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(post.likedBy.length || 0);

    useEffect(() => {
        const isLiked = post.likedBy?.includes(currentUser.uid);
        setLocalLiked(isLiked);  // รีเซ็ต state เมื่อ query isLiked เปลี่ยน
    }, [post.likedBy, currentUser]);

    useEffect(() => {
        setLocalLikeCount(post.likedBy?.length || 0);  // รับค่าล่าสุดจาก post
    }, [post.likedBy]);

    const isSaved = savedPosts?.data?.some((p) => p === post.blog_id) || false
    const queryClient = useQueryClient()
  
    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = await getFirebaseToken() // ตรงนี้ทำให้ช้า เพราะต้องรอ firebase token
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
            return axios.delete(`${import.meta.env.VITE_API_URL}/users/${post.blog_id}`, {
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
    // const isLiked = likedPosts?.data?.some((p) => p === post.blog_id || false)

    const likeMutation = useMutation({
        mutationFn: async () => {
            const token = await getFirebaseToken();
            return axios.patch(`${import.meta.env.VITE_API_URL}/posts/like`, {
                postId: post.blog_id,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },

        onMutate: async () => {
            // 1. Cancel ongoing query
            await queryClient.cancelQueries({ queryKey: [likedPosts] })
            await queryClient.cancelQueries({ queryKey: ["post", post.blog_id] })

            // 2. Snapshot previous values (for rollback)
            const prevLiked = localLiked;
            const prevCount = localLikeCount;

            // 3. Optimistically update local state
            const nextLiked = !prevLiked;
            const nextCount = prevCount + (nextLiked ? 1 : -1);

            setLocalLiked(nextLiked);
            setLocalLikeCount(nextCount);

            return { prevLiked, prevCount };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["likedPosts"] }); //เพื่อให้รู้ว่า user ยัง like อยู่ไหม
            queryClient.invalidateQueries({ queryKey: ["post", post.blog_id] });
            //เพื่ออัปเดต likedBy.length
            toast.success("Updated like status");
        },
        // onError: (err) => {
        //     toast.error(err.response?.data || "Like error");
        // }
        onError: (err, _variables, context) => {
            // rollback to previous state
            setLocalLiked(context.prevLiked);
            setLocalLikeCount(context.prevCount);
            toast.error(err.response?.data || "Like error");
        },

        onSettled: () => {
            // Re-fetch to ensure data is in sync
            queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["post", post.blog_id] });
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate()
    }

    const handleSave = () => {
        if (!userLoggedIn) {
            return navigate("/login")
        }
        saveMutation.mutate()
    }

    const handleLike = () => {
        // likeMutation.mutate(undefined, {
        //     onSuccess: () => {
        //         setLocalLiked((prev) => !prev);
        //         setLocalLikeCount((prev) => localLiked ? prev - 1 : prev + 1);
        //     },
        // })
        likeMutation.mutate()
    }

    return (
        <div className="flex items-center justify-center gap-6 ">
            {/* VIEW */}
            <span className="flex items-center">
                <MdOutlineRemoveRedEye className="text-2xl text-gray-500 gap-1" />
                <span className="px-2 text-gray-600">{post.visit}</span>
            </span>

            {/* LIKE/SAVE */}
            {isPending ? (
                "Loading..."
            ) : error ? (
                "Save post fail"
            ) : (
                <>
                    {/* Like */}
                    <span className="flex items-center">
                        {localLiked ? (
                            <GoHeartFill
                                onClick={handleLike}
                                className="text-2xl text-red-500 cursor-pointer hover:scale-110 transition-transform"
                            />

                        ) : (
                            <GoHeart
                                onClick={handleLike}
                                className="text-2xl text-gray-400 cursor-pointer hover:scale-110 transition-transform"
                            />
                        )}
                        <span className="px-2 text-gray-600">{localLikeCount}</span>
                    </span>
                    {/* Save */}
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
                </>
            )
            }
            {/* OWNER ONLY ACTION */}
            {
                <div ref={closeRef} className="relative">
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
                </div>
            }
        </div >
    )
}

export default PostMenuActions