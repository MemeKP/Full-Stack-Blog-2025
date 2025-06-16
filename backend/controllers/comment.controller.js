import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"

export const getPostComments = async (req, res) => {

}

export const deleteComment = async (req, res) => {

}

export const addComment = async (req, res) => {
    const firebaseUser = req.user; // จาก verifyFirebaseToken
    const firebaseUid = firebaseUser.uid;

    const { postId } = req.params;
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
        await Post.findByIdAndUpdate(_id,
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

        return res.status(201).json({
            message: "Comment added successfully!",
            comment: commentFile,
        })

        /*OPTIONAL -> LATER */
        /* let notification = {
        type: "commeny"
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id,
        ...
        */

    } catch (error) {
        console.log("Add comment error: ", error);
        return res.status(500).json({error: "Internal server error"})
    }
}