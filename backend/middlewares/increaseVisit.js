import Post from "../models/post.model.js"

const increaseVisit = async (req, res, next) => {
    try {
        const blog_id = req.params.blog_id

        await Post.findOneAndUpdate({blog_id}, {$inc: {visit: 1}})
        next()
        res.status(201)
    } catch (error) {
        console.error("Fail to increase view: ", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export default increaseVisit