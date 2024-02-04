
import mongoose from "mongoose";

//schema: //filds(data)
let userSchema = new mongoose.Schema({
    userName:String,
    age:Number,
    email:String,
    password:String,
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user' },
    isverified : {
        type: Boolean,
        default: false
    },
    address: [
        {
          Street:String,
          city:String
        }
      ],
      resetCode:{
        type:String,
        default:''
    },
    isActive: { 
        type: Boolean, 
        default: true }
},{
    timestamps:true
});

// model
const userModel = mongoose.model('user', userSchema);

export default userModel;