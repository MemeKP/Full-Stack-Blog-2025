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
        default: "https://ik.imagekit.io/496kiwiBird/defaultprofile.png?updatedAt=1749116554163"
    },
    savedPosts: {
        type: [String],
        default: [],
    },
    likedPosts: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

export default mongoose.model("User", userSchema)