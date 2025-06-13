import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import slugify from "slugify"

//generate unique slug -> no need
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

export const createPost = async (req, res) => {
  try {
    const firebaseUser = req.user; // จาก verifyFirebaseToken
    const firebaseUid = firebaseUser.uid;

    const {
      title,
      desc,
      banner,
      category,
      tags,
      content,
      draft
    } = req.body;

    if (!title || !desc || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .trim() + "-" + Date.now();

    // User model ที่เชื่อมกับ firebaseUid
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) return res.status(401).json({ error: "User not found" });

    const newPost = new Post({
      title,
      desc,
      banner,
      category,
      tags,
      content,
      draft,
      slug,
      blog_id: slug,
      author: user._id, // MongoDB ObjectId ของ user
      publishedAt: draft ? null : new Date()
    });

    const saved = await newPost.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
    console.log("✏️ [UPDATE POST] postId:", req.params.id);
    console.log("✏️ [UPDATE POST] body:", req.body);

    try {
        const { title, slug, ...rest } = req.body;

        let finalSlug = slug;
        if (!finalSlug || finalSlug === 'null') {
            finalSlug = await generateUniqueSlug(title || "untitled");
        }
        const updatePost = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } //return update doc
        )
        res.status(200).json(updatePost)
    } catch (err) {
        res.status(500).json({ error: "Failed to update post" })
    }
}

export const deletePost = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("post has been delete")
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, 
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})
export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
}

// export const createPost = async (req, res) => {
//     // let authorId = req.user;
//     let { title, desc, banner, category, tags, content, draft } = req.body;

//     if (!title.length) {
//         return res.status(403).json({ error: "You must provide a title to publish the blog" })
//     }

//     if (!desc) {
//         return res.status(403).json({ error: "You must provide a description to publish the blog" })
//     }

//     let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
//     console.log(blog_id)

//     const newPost = new Post({
//         title,
//         desc,
//         banner,
//         content,
//         tags,
//         author: authorId,
//         category,
//         // slug,
//         blog_id,
//         draft: Boolean(draft),
//         publishedAt: draft ? null : new Date(),
//     });

//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
// }
// export const createPost = async (req, res) => {
//     const newPost = new Post(req.body)

//     const post = await newPost.save();
//     res.status(200).json(post)
// }

// export const createPost = async (req, res) => {
//     console.log("🚨 [CREATE POST] Payload:", req.body);
//     try {
//         const { title } = req.body;

//         const slug = await generateUniqueSlug(title || "untitled", req.body.slug);
//         const newPost = new Post({ ...req.body, slug });

//         const post = await newPost.save();
//         res.status(200).json(post);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to create post" });
//     }
// };
// export const createPost = async (req, res) => {
//     try {
//         const { title, slug, ...rest } = req.body;

//         let finalSlug = slug;
//         if (!finalSlug || finalSlug === 'null') {
//             finalSlug = await generateUniqueSlug(title);
//         }

//         const newPost = new Post({
//             ...rest,
//             title,
//             slug: finalSlug,
//         });

//         const savedPost = await newPost.save();
//         res.status(201).json(savedPost);
//     } catch (err) {
//         console.error("Error creating post:", err);
//         res.status(500).json({ message: 'Failed to create post' });
//     }
// };