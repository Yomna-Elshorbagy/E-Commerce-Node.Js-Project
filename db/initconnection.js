
// import mongoose from "mongoose";

// const initconnection =()=>{
// // mongoose.connect('mongodb://127.0.0.1:27017/ProjectDb')
// mongoose.connect("mongodb+srv://Yomna-mohamed:ghxuO3Pa4OkKEE1H@cluster0.zbpwgph.mongodb.net/E-commerce")
// .then(()=>console.log("DB connected"))
// .catch((err)=>console.log("error", err))
// }

// export default initconnection;
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const initconnection = () => {
    const mongodbURI = process.env.MONGODB_URI; // Retrieve MongoDB connection string from environment variable

    return mongoose.connect(mongodbURI, 
    
        )
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
}

export default initconnection;