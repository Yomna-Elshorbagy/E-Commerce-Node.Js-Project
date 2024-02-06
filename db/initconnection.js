
import mongoose from "mongoose";

const initconnection =()=>{
// mongoose.connect('mongodb://127.0.0.1:27017/ProjectDb')
mongoose.connect("mongodb+srv://Yomna-mohamed:ghxuO3Pa4OkKEE1H@cluster0.zbpwgph.mongodb.net/E-commerce")
.then(()=>console.log("DB connected"))
.catch((err)=>console.log("error", err))
}

export default initconnection;