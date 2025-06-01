import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "blogs",
    },
    blog_author:{
        type: String,
        required: true,
        ref: "blogs",
    },
    comment:{
        type: String,
        required: true,
    },
    children:{
        type: [Schema.Types.ObjectId],
        ref: "comments"
    },
    comment_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    isReply:{
        type: Boolean,
    },
    parent:{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
}, {
    timestamps: {
        createdAt: 'commentedAt', //true
    }
});

export default mongoose.model("Comment", commentSchema)