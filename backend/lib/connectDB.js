import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCATION);
        serverSelectionTimeoutMS: 15000, // default คือ 30,000ms
        console.log('mongodb is connected!')
    } catch (error) {
        console.log(error);
        process.exit(1); // ออกจาก process ถ้าเชื่อมต่อไม่ได้
    }
}

export default connectDB