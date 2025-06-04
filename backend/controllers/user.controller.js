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
