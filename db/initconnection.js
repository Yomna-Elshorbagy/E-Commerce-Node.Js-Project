// export default initconnection;
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const initconnection = () => {
    const mongodbURI = process.env.MONGODB_URI; // Retrieve MongoDB connection string from environment variable

    return mongoose.connect(mongodbURI, 
    
        )
        .then(() => console.log("DB connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
}

export default initconnection;