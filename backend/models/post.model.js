import mongoose, { Schema } from "mongoose";

/*
* Used for:
* - Write Page (เวลาเขียนเสร็จแล้วกด Publish → ส่งไปสร้าง Document ใหม่ใน Post collection)
* - Post Page (ใช้ _id ไป fetch ข้อมูลจาก Post มาแสดง)
* - Edit Page (ใช้ postId ไป fetch + แก้ไขข้อมูลเดิมใน MongoDB)
* - Homepage/Feed/Filter/Search (ดึงข้อมูลจาก Post หลายรายการเพื่อแสดงรายการ blog)
* - Bookmark/Reaction/Comment (อ้างอิงกับ Post._id) *maybe later*
*/
const postSchema = new Schema({
       blog_id: {
            type: String,
            required: true,
            unique: true,
        },
        title:{
            type: String,
            required: true,
        }, 
        banner:{
            type: String,
            // required: true,
        },
        desc: {
            type: String,
            // maxlength: 200,
            required: true,
        },
        content:{
            type: String, //[]
            required: true,
        },
        category: {
            type: String,
            default: "general",
        },
        tags: {
            type: [String],
            // required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        activity: {
            total_likes: {
                type: Number,
                default: 0,
            },
            total_comments: {
                type: Number,
                default: 0,
            },
            total_reads: {
                type: Number,
                default: 0,
            },
            total_parent_comments: {
                type: Number,
                default: 0,
            },
        },
        comments: {
            type: [Schema.Types.ObjectId],
            ref: "Comment"
        },
        publishedAt: {
            type: Date,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        visit: {
            type: Number,
            default: 0,
        },
        draft: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: {
        createdAt: 'publishedAt', 
        // createdAt: true, 
    }
});

export default mongoose.model("Post", postSchema)

// user: {
    //     type: Schema.Types.ObjectId, 
    //     ref: "User", 
    //     required: true,
    // },
    // img: {
    //     type: String
    // },
    // title: {
    //     type: String,
    //     required: true
    // },
    // slug: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // desc: {
    //     type: String,
    // },
    // content: {
    //     type: String,
    //     required: true,
    // },
      // blog_id: {
        //     type: String,
        //     required: true,
        //     // unique: true,
        // },
        //  isPublishedAt: { //for draf blog
        //     type: Boolean,
        //     default: false,
        // },