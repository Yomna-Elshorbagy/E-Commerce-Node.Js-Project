import express  from "express";
import { deactivateUser, deleteUser, forgetPassword, getAllUser, resetPassword, signIn, signUp, sortedUsers, updateUser, verification, verifyCode } from "./controller/user.controller.js";
import { validation } from "../../middleware/validation.js";
import { addUserSchema, resetPasswordSchema, updateuservalidation } from "./users.validation.js";
import { adminAuth, auth } from "../../middleware/auth.js";
const userRoutes = express.Router()

//add user 
userRoutes.post("/users/signup",validation(addUserSchema), signUp)//signup
userRoutes.post("/users/signin", signIn) //signin

//getusers
userRoutes.get('/users', getAllUser)

//get verified account
userRoutes.get('/user/verify/:token', verification)

//updateuser:
userRoutes.patch("/user/:id",validation(updateuservalidation),adminAuth, updateUser)

//deleteuser:

//delete by mail
// userRoutes.delete("/deleteduser", async(req,res)=>{
//     let foundeduser = await userModel.findOneAndDelete({email: req.body.email})
//     if(foundeduser){
//         res.json({message:"User Deleted",foundeduser})
//     } else{
//         res.json({message:"user not found"})
//     }
// })

//delete using params
userRoutes.delete("/user/:id", deleteUser)

//deactivated
userRoutes.post('/deactivateUser', adminAuth, deactivateUser);

//sorted users
userRoutes.get("/sortedUser", sortedUsers)

//forget & reset password
userRoutes.post('/forgetPassword', forgetPassword);
userRoutes.post('/verifyCode', verifyCode); 
userRoutes.post('/resetPassword', validation(resetPasswordSchema), resetPassword); 





    export default userRoutes;
