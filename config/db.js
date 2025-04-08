import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        if (!process.env.MONGODB_URI || !DB_NAME) {
            throw new Error("MONGODB_URI or DB_NAME is not defined in environment variables.");
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection failed", error);
        process.exit(1)
    }
}


export default connectDB