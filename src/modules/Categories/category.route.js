import express  from "express";
import { addcategory,  addimg,  allcategoriesCreatedByUser, deleteCategory, getAllCategories, getCategoryByName, updateCategory } from "./controller/category.controller.js"

import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import Categorymodel from "../../../db/models/category.js";
import { adminAuth, auth } from "../../middleware/auth.js";
import { addCategrySchema, updateCategrySchema } from "./Category.validation.js";
import { validation } from "../../middleware/validation.js";
uuidv4();
const categoryRoutes = express.Router()


categoryRoutes.post("/category", addimg, validation(addCategrySchema),adminAuth , addcategory);
categoryRoutes.get('/category', getAllCategories)//to get all categories
categoryRoutes.get('/categoryName', getCategoryByName)//related by id of Creator
categoryRoutes.get('/category/:id', allcategoriesCreatedByUser)//related by id of Creator
categoryRoutes.patch("/category/:categoryId",validation(updateCategrySchema),auth, updateCategory) //who created the category
categoryRoutes.delete("/category/:id",adminAuth, deleteCategory) 


//multer middleware
// const upload = multer({dest:"uploads/"})
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//     //   cb(null,Date.now()+"_"+ file.originalname)
//     cb(null, uuidv4() +"_"+ file.originalname)
  
//     }
//   })
  
//   const upload = multer({ storage: storage })
  
//   categoryRoutes.post("/categor",upload.single('image'),async(req,res)=>{
//     console.log(req.file, req.body)
//     req.body.image =req.file.filename
//     let added = await Categorymodel.insertMany(req.body)
//     res.json({message:"categore", added})
//   })


export default categoryRoutes;

