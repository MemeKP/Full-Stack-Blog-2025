// src/utils/sendUserToServer.js
export const sendUserToServer = async (user) => {
  if (!user) return;

  try {
    const token = await user.getIdToken();

    console.log("👉 User Info:", {
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
    });
    // console.log("👉 Token:", token);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
      }),
    });

    if (!res.ok) throw new Error("Failed to sync user");
    const data = await res.json();
    console.log("✅ User synced with MongoDB:", data);
    // return data; //ปรับ sendUserToServer() ให้คืนค่า MongoDB user (ที่มี _id) แล้วเก็บไว้ใช้
  } catch (err) {
    console.error("❌ Error syncing user:", err.message);
  }
};

