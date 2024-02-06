
import Jwt  from "jsonwebtoken"
import userModel from "../../db/models/user.model.js";

export const auth =(req, res, next)=>{
    let {authorization} = req.headers;
    console.log(authorization)
    let token = authorization.split(" ")[1]
    Jwt.verify(token, "yomna",async (err,decoded)=>{
      console.log(decoded)
        if (err) return res.json({message: "token error", err});
        const user = await userModel.findById(decoded.id)
        console.log(user)
        req.userRole= user.role
        req.userid=decoded.id
        next()
    })
}

export const adminAuth = async (req, res, next) => {
    auth(req, res, () => {
      if (req.userRole === "admin") {
        next();
      } else {
        return res.json({ message: "this is admin authority only" });
      }
    });
  };



