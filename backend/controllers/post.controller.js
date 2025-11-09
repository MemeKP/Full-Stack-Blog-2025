import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  /*เพิ่ม page, limit เพื่อทำ infinite scroll */
  const page = parseInt(req.query.page) || 1;
  const noLimit = req.query.noLimit === "true";
  const limit = req.query.limit ? parseInt(req.query.limit) : (noLimit ? 0 : 5);
  const search = req.query.search || "";
  const category = req.query.category?.trim().toLowerCase() || "";
  const sort = req.query.sort || "newest"; // ให้ defult เป็น newest
  const featured = req.query.featured;

  const query = {
    draft: false, // ดึงเฉพาะโพสต์ที่ publish แล้ว พวก test slug test postman postจะไม่เห็น
  };
  console.log(query);

  // ถ้ามี category → เพิ่มเข้า query
  // ใช้ regex แทน toLowerCase เพื่อป้องกัน case-insensitive ของ mongoDB
  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  let searchQuery = {};

  //ถ้ามี search ให้ใช้ regex ค้นใน title หรือ tags
  const searchRegex = new RegExp(search, "i");
  if (search) {
    searchQuery = {
      $or: [
        { title: { $regex: searchRegex } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ],
    };
  }

  let sortObj = { publishedAt: -1 };
  if (sort) {
    switch (sort) {
      case "newest":
        sortObj = { publishedAt: -1 };
        break;
      case "oldest":
        sortObj = { publishedAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { 'activity.total_likes': -1};
        // // เงื่อนไขเวลา
        // const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        // const MonthsAgo = new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000);
        // const recentPostCount = await Post.countDocuments({
        //   ...finalQuery,
        //   publishedAt: { $gte: oneWeekAgo }
        // });
        // // ถ้าไม่มีโพสต์ใน 7 วัน ให้ขยายเป็น 90 วัน
        // if (recentPostCount === 0) {
        //   query.publishedAt = { $gte: MonthsAgo };
        //   console.log("No posts in 7 days, extending to 30 days");
        // } else {
        //   query.publishedAt = { $gte: oneWeekAgo };
        // }
        break;
      default:
        break;
    }
  }
  if (featured) {
    query.isFeatured = true;
  }
  const finalQuery = {
    ...query,
    ...searchQuery,
  };

  console.log("req.query.sort:", sort);
  console.log("Sort object:", sortObj);
  console.log(" Final MongoDB query:", JSON.stringify(finalQuery, null, 2));
  try {
    const posts = await Post.find(finalQuery)
      .populate("author", 'username profile_img uid')
      .limit(limit) // ถ้า limit = 0 จะไม่จำกัด
      .skip((page - 1) * limit)
      .sort(sortObj); //เรียงจาก post ล่าสุดก่อน

    // console.log("MongoDB query:", JSON.stringify(searchQuery, null, 2));
    // console.log("Posts matched:", posts.map(p => p.title));  // ดูชื่อ title จริง
    console.log(posts.map(p => ({ id: p._id, title: p.title })));
    const totalPosts = await Post.countDocuments(finalQuery);
    const hasMore = !noLimit && page * limit < totalPosts;
    console.log("✅ Posts found:", posts.length);
    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("Error in getPosts:", error);
    res.status(500).json("Failed to fetch posts");
  }
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ blog_id: req.params.blog_id }).populate(
    "author",
    "username"
  );
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  try {
    const firebaseUser = req.user; // จาก verifyFirebaseToken
    const firebaseUid = firebaseUser.uid;

    const { title, desc, banner, category, tags, content, draft } = req.body;

    if (!title || !desc || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug =
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .trim() +
      "-" +
      Date.now();

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
      publishedAt: draft ? null : new Date(),
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
    if (!finalSlug || finalSlug === "null") {
      finalSlug = await generateUniqueSlug(title || "untitled");
    }
    const updatePost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //return update doc
    );
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const firebaseUser = req.user;
    const firebaseUid = firebaseUser?.uid;

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
      author: user._id,
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
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};

export const likePost = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    if (!firebaseUid) {
      return res.status(401).json("User not authenticated!");
    }

    const postId = req.body.postId;
    if (!postId) {
      return res.status(404).json("Post not found!");
    }

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const post = await Post.findOne({ blog_id: postId });
    if (!post.likedBy) post.likedBy = [];

    const isLiked = post.likedBy.includes(firebaseUid);
    console.log("postid: ", postId);

    if (!isLiked) {
      await Post.findByIdAndUpdate(post._id, {
        $push: { likedBy: firebaseUid },
      });
      await User.findByIdAndUpdate(user._id, {
        $push: { likedPosts: post.blog_id },
      });
    } else {
      await Post.findByIdAndUpdate(post._id, {
        $pull: { likedBy: firebaseUid },
      });
      await User.findByIdAndUpdate(user._id, {
        $pull: { likedPosts: post.blog_id },
      });
    }

    await post.save();
    await user.save();

    console.log(
      `${firebaseUid} ${isLiked ? "❌ unliked" : "✅ liked"} post: ${postId}`
    );
    res.status(200).json(isLiked ? "Unliked" : "Liked");
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json("Internal Server Error");
  }
};

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