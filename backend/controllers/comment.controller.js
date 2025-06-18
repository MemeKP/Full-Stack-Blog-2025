import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ blog_id: req.params.postId, isReply: false })
            .populate({
                path: "comment_by",
                select: "username profile_img"
            }) // show username and user's profile
            // .populate({
            //     path: "children",
            //     populate: { // show replies
            //         path: "comment_by",
            //         select: "username profile_img"
            //     }
            // })
            .sort({ createdAt: -1 }) // lastest comment ขึ้นก่อน
            // .lean() //ใช้ lean() ไม่ได้ รูปจะไม่ขึ้น

        res.status(200).json(comments)
    } catch (error) {
        console.error("Something went wrong: ", error)
        res.status(500).json({ error: "Fail to get comments!" })
    }
}

export const deleteComment = async (req, res) => {
    const firebaseUser = req.user;
    const firebaseUid = firebaseUser.uid;

    const user = await User.findOne({ uid: firebaseUid })
    if (!firebaseUid) {
        return res.status(401).json({ error: "User not found or Not authenticated" });
    }

    const deletedComment = await Comment.findOneAndDelete({
        _id: id,
        user: user._id,
    })

    if (!deletedComment) {
        return res.status(403).json("You acn only your comment!")
    }

    res.status(200).json("comment deleted!")
}

export const addComment = async (req, res) => {
    const firebaseUser = req.user; // จาก verifyFirebaseToken
    const firebaseUid = firebaseUser.uid;

    // const {postId} = req.params;
    const postId = req.params.postId //จาก mutation in commentSection component
    const { comment, blog_author, parentId } = req.body;

    if (!comment?.trim()) {
        return res.status(403).json({ error: "write something to leave a comment" })
    }

    try {
        // find user from uid
        const user = await User.findOne({ uid: firebaseUid })
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isReply = !!parentId;

        // creating a comment doc
        let commentObj = new Comment({
            blog_id: postId,
            blog_author,
            comment,
            comment_by: user._id,
            isReply: false,
            parent: parentId || null,
        })

        const commentFile = await commentObj.save() //commentFile refering to the data that had saved in the database

        // one we done creating a comment, then update the blog so that it can have a latest number of total commnet  counts
        await Post.findByIdAndUpdate(postId,
            {
                $push: { "comments": commentFile._id },
                $inc: {
                    "activity.total_comments": 1,
                    ...(isReply
                        ? {} // ถ้าเป็น reply ไม่เพิ่ม parent
                        : { "activity.total_parent_comments": 1 }),
                }
            }
        );
        console.log("======== Incoming Comment ========");
        console.log("Firebase User:", firebaseUser);
        console.log("Post ID:", postId);
        console.log("Body:", req.body);
        console.log("==================================");

        // populate ก่อนส่งกลับ
        // await commentFile.populate({
        //     path: "comment_by",
        //     select: "username profile_img",
        // });

        return res.status(201).json({
            message: "Comment added successfully!",
            comment: commentFile,
        })

    } catch (error) {
        console.log("Add comment error: ", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}


/*OPTIONAL -> LATER */
/* let notification = {
type: "commeny"
blog: _id,
notification_for: blog_author,
user: user_id,
comment: commentFile._id,
...
*/