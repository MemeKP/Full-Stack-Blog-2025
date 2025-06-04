import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    profile_img:{
        type: String,
    },
    savedPosts: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

export default mongoose.model("User", userSchema)