// src/utils/sendUserToServer.js
export const sendUserToServer = async (user) => {
  if (!user) return;

  try {
    const token = await user.getIdToken(); // ดึง Firebase ID token
    const res = await fetch("http://localhost:3000/users/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ถ้ามีตรวจ token ฝั่ง backend
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0], // ใช้ชื่อจริงหรือ fallback
        photoURL: user.photoURL,
      }),
    });

    if (!res.ok) throw new Error("Failed to sync user");
    const data = await res.json();
    console.log("User synced with MongoDB:", data);
  } catch (err) {
    console.error(" Error syncing user:", err.message);
  }
};
