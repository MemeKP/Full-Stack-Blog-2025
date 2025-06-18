import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    blog_author:{
        type: String,
        required: true,
        ref: "User", // Post
    },
    comment:{
        type: String,
        required: true,
    },
    children:{
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    },
    comment_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    isReply:{
        type: Boolean,
    },
    parent:{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
}, {
    timestamps: {
        createdAt: 'commentedAt', //true
    }
});

export default mongoose.model("Comment", commentSchema)