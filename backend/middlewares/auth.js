import admin from "../utils/firebase.js"

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🟨 Incoming Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const idToken = authHeader.split(' ')[1];
  console.log("Token received:", idToken);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Decoded Token:', decodedToken);
    req.user = decodedToken; // ให้ใช้ req.user.uid
    req.auth = decodedToken; // ให้ใช้ req.auth.sessionClaims
    next();
  } catch (error) {
    console.error("Firebase token verify failed", error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};
