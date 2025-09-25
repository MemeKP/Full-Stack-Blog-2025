import React, { useState } from "react"
import Comment from "./Comment"
import axios from "axios";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/authContext/userAuthContext";
import toast, { Toaster } from 'react-hot-toast';
// import { getIdToken } from "firebase/auth";

//Fetch blog page
const fetchComments = async (postId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${postId}`);
    return res.data ?? [];
};

const CommentSection = ({ postId, authorName }) => { //authorName
    const { userLoggedIn, getFirebaseToken, currentUser } = useAuth();
    // const [isLikedByUser, setIsLikedByUser] = useState(false)
    // const [commentWrapper, setCommentWrapper] = useState(true)
    // const [totalParentComment, setTotalParentComment] = useState(0)
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

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getFirebaseToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/api/comments/${postId}`, newComment, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        },
        onError: (error) => {
            toast.error(error.response.data)
        }
    })

    const { isPending, error, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        // enabled: !!postId
    });

    const handlePost = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target); // e.target ตอนนี้คือ <form>
        const commentText = formData.get("desc").trim();
        if (!commentText) {
            return toast.error("Write something first!");
        }
        console.log("Submitted comment:", commentText);
        const data = {
            comment: commentText,
            blog_author: authorName
        }
        mutation.mutate(data);
        // ในอนาคต //
        // mutation.mutate({
        //     comment: commentText,
        //     blog_author: "mairoo", // สมมุติว่าเก็บไว้ใน state หรือ prop
        //     parentId: null,        // ถ้าไม่ใช่ reply
        // });

        setNewComment(""); // ล้างกล่องหลังโพสต์
    };

    return (
        <div className="w-full mx-auto">
            <form onSubmit={handlePost} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{isPending ? "Loading..." : error ? "Error" : `Responses(${data.length})`}</h2>
                {/* FORM INPUT */}
                <div className="mb-4">
                    <textarea
                        name="desc"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What's your thoughts?"
                        className="w-full min-h-[120px] p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-y"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 duration-100"
                    >
                        Post
                    </button>
                </div>
            </form>


            {/* COMMENT LIST */}
            <div className="mt-8 space-y-6">
                {isPending ? "Loading..." : error ? "Error loading comment." : (data ?? []).map((comment) => (
                    <Comment key={comment._id} comment={comment} postId={postId}/>
                ))}
            </div>
        </div>
    )
}

export default CommentSection