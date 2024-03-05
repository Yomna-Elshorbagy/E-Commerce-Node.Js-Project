import express  from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, image, updateProduct, updateProductt } from "./controllers/product.controller.js";
import { adminAuth } from "../../middleware/auth.js";
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import productModel from "../../../db/models/product.model.js";
import { validation } from "../../middleware/validation.js";
import {addproductValidationSchema, updateproductValidationSchema}  from "./products.validatio.js";
uuidv4();

const productsRoutes = express.Router()

productsRoutes.post("/products",image, validation(addproductValidationSchema),adminAuth, addProduct)
productsRoutes.patch('/products/:productId', validation(updateproductValidationSchema),adminAuth,updateProduct);
productsRoutes.put('/products/:productId',updateProductt);
productsRoutes.delete('/products/:id',adminAuth, deleteProduct);
productsRoutes.get('/products', getAllProducts);
productsRoutes.get('/products/:id', getProductById);
productsRoutes.get('/productsC', getProductsByCategory);






export default productsRoutes;