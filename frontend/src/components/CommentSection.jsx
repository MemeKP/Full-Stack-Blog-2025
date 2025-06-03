import React, { useState } from "react"
import Comment from "./Comment"
import IKImageWrapper from "./IKImageWrapper";

const CommentSection = () => {
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

    const [newComment, setNewComment] = useState("");

    const handlePost = () => {
        if (newComment.trim() === "") return;
        const newEntry = {
            id: comments.length + 1,
            profile: {
                name: "Anonymous",
                avatar: "post2.jpg",
                userId: "anonymous"
            },
            date: "Just Now",
            content: newComment,
            Likes: 0,
            replies: [],
        };
        setComments([...comments, newEntry]);
        setNewComment("");
    }

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