
import mongoose from "mongoose";

const initconnection =()=>{
mongoose.connect('mongodb://127.0.0.1:27017/ProjectDb')
.then(()=>console.log("DB connected"))
.catch((err)=>console.log("error", err))
}

export default initconnection;