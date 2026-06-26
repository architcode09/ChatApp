import mongoose from "mongoose";

export async function connectionDB() {
    try{
        const mongoUri=process.env.MONGO_URI
        if(!mongoUri) {
            throw new Error("Mongo_URI is required");
        }

        const conn = await mongoose.connect(mongoUri);
        console.log("MongoDB connected",conn.connection.host);
        

    } catch(error) {
        console.error("MongoDB connection error :",error.message);
        process.exit(1);
        // 1=failure and 0=success
    }
}