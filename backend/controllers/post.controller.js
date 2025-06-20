import ImageKit from "imagekit";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import slugify from "slugify"

export const getPosts = async (req, res) => {
  /*เพิ่ม page, limit เพื่อทำ infinite scroll */
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 2

  const posts = await Post.find()
    //Show author of the blog
    .populate("author", "username")
    .limit(limit)
    .skip((page - 1) * limit) //1st page จะเป็น 0 ก็จะโชว์โพสต์ตาม limit (5) และเมื่อ 2nd -> 2-1*5 = 5 (skip first 5 and show the next 5)

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts

  res.status(200).json({ posts, hasMore })

}

// export const getPost = async (req, res) => {
//     const post = await Post.findOne({ slug: req.params.slug }).populate("author", "username")
//     res.status(200).json(post)
// }
export const getPost = async (req, res) => {
  const post = await Post.findOne({ blog_id: req.params.blog_id }).populate("author", "username")
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
  try {
    const firebaseUser = req.user;
    const firebaseUid = firebaseUser?.uid

    if (!firebaseUid) {
      return res.status(401).json("User not authenticated!");
    }

    const role = req.auth?.sessionClaims?.metadata?.role || "user"; // ของระบบ admin auth มาจาก useUser()

    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted");
    }

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) return res.status(401).json("User not found!");

    console.log("Target user id", user._id);
    const post = await Post.findOne({ blog_id: req.params.id });
    console.log("Post user", post?.author);
    console.log("Post found by blog_id:", post);

    if (!post) return res.status(404).json("Post not found");

    if (post.author.toString() !== user._id.toString()) {
      return res.status(403).json("You can delete only your posts!");
    }

    const deletedPost = await Post.findOneAndDelete({
      blog_id: req.params.id,
      author: user._id
    });

    await Post.deleteOne({ blog_id: req.params.id });

    if (!deletedPost) {
      return res.status(403).json("You can delete only your posts!");
    }

    res.status(200).json("Post has been deleted");
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json("Internal server error");
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})
export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
}

export const likePost = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    if (!firebaseUid) {
      return res.status(401).json("User not authenticated!")
    }

    const postId = req.body.postId
    if (!postId) {
      return res.status(404).json("Post not found!")
    }

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
      return res.status(404).json("User not found!")
    }

    const post = await Post.findOne({ blog_id: postId });
    if (!post.likedBy) post.likedBy = [];

    const isLiked = post.likedBy.includes(firebaseUid);
    console.log('postid: ', postId)
    
    if (!isLiked) {
      await Post.findByIdAndUpdate(post._id, {
        $push: { likedBy: firebaseUid }
      });
      await User.findByIdAndUpdate(user._id, {
        $push: { likedPosts: post.blog_id }
      });
    } else {
      await Post.findByIdAndUpdate(post._id, {
        $pull: { likedBy: firebaseUid }
      });
      await User.findByIdAndUpdate(user._id, {
        $pull: { likedPosts: post.blog_id }
      });
    }

    await post.save();
    await user.save();

    console.log(`${firebaseUid} ${isLiked ? "❌ unliked" : "✅ liked"} post: ${postId}`);
    res.status(200).json(isLiked ? "Unliked" : "Liked");
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json("Internal Server Error");
  }
};

// GET /posts/:postId/likes
export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ blog_id: postId });

    if (!post) {
      return res.status(404).json("Post not found");
    }

    res.status(200).json(post.likedBy); // => [uid1, uid2, ...]
  } catch (err) {
    console.error("Error getting likedBy:", err);
    res.status(500).json("Internal server error");
  }
};

// export const likePost = async (req, res) => {
//   try {
//     const firebaseUid = req.user.uid;
//     if (!firebaseUid) {
//       return res.status(401).json("User not authenticated!")
//     }

//     const postId = req.body.postId
//     if (!postId) {
//       return res.status(404).json("Post not found!")
//     }

//     const user = await User.findOne({ uid: firebaseUid });
//     if (!user) {
//       return res.status(404).json("User not found!")
//     }

//     const post = await Post.findOne({ blog_id: postId });
//     if (!post.likedBy) post.likedBy = [];

//     const isLiked = post.likedBy.includes(firebaseUid);
//     // const isLiked = user.likedBy.some((p) => p === postId)
//     console.log('postid: ', postId)
//     // if (isLiked) {
//     //   post.likedBy.pull(firebaseUid);
//     //   user.likedPosts = user.likedPosts.filter(p => p !== postId);
//     // } else {
//     //   post.likedBy.push(firebaseUid);
//     //   user.likedPosts.push(postId);
//     // }
//     if (!isLiked) {
//       await Post.findByIdAndUpdate(post._id, {
//         $push: { likedBy: firebaseUid}
//       })
//     } else {
//       await Post.findByIdAndUpdate(post._id), {
//         $pull: { likedBy: firebaseUid}
//       }
//     }

//     await post.save();
//     await user.save();

//     console.log(`✔ ${firebaseUid} ${isLiked ? "unliked" : "liked"} post: ${postId}`);
//     res.status(200).json(isLiked ? "Unliked" : "Liked");
//   } catch (err) {
//     console.error("Like Error:", err);
//     res.status(500).json("Internal Server Error");
//   }
// };

// //generate unique slug -> no need
// const generateUniqueSlug = async (title, desiredSlug = null) => {
//     const baseSlug = desiredSlug
//         ? slugify(desiredSlug, { lower: true, strict: true })
//         : slugify(title, { lower: true, strict: true });

//     let slug = baseSlug;
//     let counter = 2;

//     while (await Post.findOne({ slug })) {
//         slug = `${baseSlug}-${counter}`;
//         counter++;
//     }

//     return slug;
// };

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