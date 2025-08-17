import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config('path=./src/.env');

const connectDB = async ()=>{

try {
    const connectionIntance = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`MongoDB connected: ${connectionIntance.connection.host}`);
    
} catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1); // Exit the process with failure
}

}

export default connectDB;