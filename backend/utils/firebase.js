import dotenv from "dotenv";
import admin from "firebase-admin";
dotenv.config();

// const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON);
// const serviceAccount = require("path/to/serviceAccountKey.json");


if (!admin.apps.length) {
    // console.log("SERVICE ACCOUNT PARSED:", serviceAccount);
   admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); 
}

export default admin;