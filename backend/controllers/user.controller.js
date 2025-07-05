import User from "../models/user.model.js"

export const createOrUpdateUser = async (req, res) => {
    try {
        const { uid, email, photoURL, name, displayName } = req.user;

        // Fallback: ถ้าไม่มี name/displayName ให้ใช้ email prefix
        const username = name || displayName || email?.split("@")[0];

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        let user = await User.findOne({ uid });

        if (user) {
            user.username = username || user.username;
            user.email = email;
            user.profile_img = photoURL || user.profile_img;
            await user.save();
        } else {
            user = await User.create({
                uid,
                username, // ต้องไม่ undefined
                email,
                profile_img: photoURL,
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving user to DB" });
    }
};

export const getUserLikedPosts = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        if (!firebaseUid) {
            return res.status(401).json("User not authenticated!");
        }
        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        console.log("✅ Found user:", user.username, "likedPosts:", user.likedPosts);
        res.status(200).json(user.likedPosts);
    } catch (err) {
        console.error("🔥 Error in getUserlikedPosts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserSavedPosts = async (req, res) => {
    try {
        const firebaseUser = req.user;
        const firebaseUid = firebaseUser.uid;

        if (!firebaseUid) {
            return res.status(401).json("User not authenticated!");
        }

        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        console.log("✅ Found user:", user.username, "savedPosts:", user.savedPosts);
        res.status(200).json(user.savedPosts);
    } catch (err) {
        console.error("🔥 Error in getUserSavedPosts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const SavePosts = async (req, res) => {
    try {
        const firebaseUser = req.user;
        if (!firebaseUser) {
            return res.status(401).json("User not authenticated!");
        }

        const firebaseUid = firebaseUser.uid;
        const postId = req.body.postId;

        if (!postId) {
            return res.status(400).json("No postId provided.");
        }

        const user = await User.findOne({ uid: firebaseUid });
        if (!user) {
            return res.status(404).json("User not found.");
        }

        const isSaved = user.savedPosts.some((p) => p === postId);

        if (!isSaved) {
            await User.findByIdAndUpdate(user._id, {
                $push: { savedPosts: postId }
            });
        } else {
            await User.findByIdAndUpdate(user._id, {
                $pull: { savedPosts: postId }
            });
        }

        res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
    } catch (err) {
        console.error("SavePosts Error:", err);
        res.status(500).json("Internal Server Error");
    }
};

