import Post from "../models/post.model.js"
import slugify from "slugify"

//generate unique slug
const generateUniqueSlug = async (title, desiredSlug = null) => {
    const baseSlug = desiredSlug 
        ? slugify(desiredSlug, { lower: true, strict: true }) 
        : slugify(title, { lower: true, strict: true });

    let slug = baseSlug;
    let counter = 2;

    while (await Post.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const getPosts = async (req, res) => {
    const posts = await Post.find()
    res.status(200).json(posts)

}

export const getPost = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug })
    res.status(200).json(post)
}

// export const createPost = async (req, res) => {
//     const newPost = new Post(req.body)

//     const post = await newPost.save();
//     res.status(200).json(post)
// }

export const createPost = async (req, res) => {
    try {
        const { title } = req.body;

        const slug = await generateUniqueSlug(title || "untitled", req.body.slug);
        const newPost = new Post({ ...req.body, slug });

        const post = await newPost.save();
        res.status(200).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create post" });
    }
};


export const deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("post has been delete")
}