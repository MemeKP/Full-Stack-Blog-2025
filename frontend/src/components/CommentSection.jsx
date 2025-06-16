import React, { useState } from "react"
import Comment from "./Comment"
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/authContext/userAuthContext";
import toast, { Toaster } from 'react-hot-toast';

//Fetch blog page
const fetchComments = async (blog_id) => {
    const res = axios.get(`${import.meta.env.VITE_API_URL}/comments/${blog_id}`);
    return (await res).data;
}

const CommentSection = () => {
    const { userLoggedIn, getFirebaseToken, currentUser } = useAuth();
    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [commentWrapper, setCommentWrapper] = useState(true)
    const [totalParentComment, setTotalParentComment] = useState(0)
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");

      // Redirect if not logged in
    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/login')
        }
    }, [userLoggedIn, navigate])

    useEffect(() => {
        console.log("userLoggedIn: ", userLoggedIn);

    }, [userLoggedIn]);

    // const { isPending, error, data } = useQuery({
    //     queryKey: ["comment", postId],
    //     queryFn: () => fetchComments(blog_id),
    // });

    // if (isPending) {
    //     return "Loading..."
    // }
    // if (error) {
    //     return "Something went wrong... " + error.message;
    // }
    // if (!data) {
    //     return "Post not found!"
    // }
    const [comments, setComments] = useState([
        {
            id: 1,
            profile: {
                name: "Hinata Shoyo",
                avatar: "profile.jpg",
                userId: "hinata"
            },
            date: "May 7",
            content: "I agreed with you.",
            likes: 28,
            replies: []
        },
        {
            id: 2,
            profile: {
                name: "KodzuKen",
                avatar: "kenmaprofile.jpg",
                userId: "kenma"
            },
            date: "May 7",
            content: "If shoyo say so.",
            likes: 30,
            replies: []
        },
        {
            id: 3,
            profile: {
                name: "Kuroo Tetsuro",
                avatar: "kuroprofile.jpg",
                userId: "kuroo"
            },
            date: "May 8",
            content: "WOW!!",
            likes: 26,
            replies: []
        },
    ])

    const handlePost = () => {
        if(!getFirebaseToken){
            return toast.error("Please login first to leave a comment")
        }
        if (!newComment.length) {
            return toast.error("Write something to leave a comment...")
        }
    }

    // const handlePost = () => {
    //     if (newComment.trim() === "") return;
    //     const newEntry = {
    //         id: comments.length + 1,
    //         profile: {
    //             name: "Anonymous",
    //             avatar: "post2.jpg",
    //             userId: "anonymous"
    //         },
    //         date: "Just Now",
    //         content: newComment,
    //         Likes: 0,
    //         replies: [],
    //     };
    //     setComments([...comments, newEntry]);
    //     setNewComment("");
    // }

    return (
        <div className="w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Responses ({comments.length})</h2>

            {/* INPUT */}
            <div className="mb-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What's your thoughts ?"
                    className="w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-y"
                >
                </textarea>
            </div>

            <div className="flex justify-end mb-8">
                <button
                    onClick={handlePost}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 duration-100"
                >
                    Post
                </button>
            </div>

            {/* COMMENT LIST */}
            <div className="mt-8 space-y-6">
                {comments.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                ))}
            </div>

        </div>
    )
}

export default CommentSection