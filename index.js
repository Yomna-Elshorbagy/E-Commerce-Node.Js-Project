import 'dotenv/config'

import express  from "express";
import initconnection from "./db/initconnection.js";
import userRoutes from "./src/modules/users/users.route.js";
import categoryRoutes from "./src/modules/Categories/category.route.js";
import productsRoutes from './src/modules/Products/products.routs.js';
import couponeRoutes from './src/modules/Coupons/coupon.routes.js';

import cors from 'cors';
import cartRoutes from './src/modules/Cart/cart.routs.js';


const server = express()
server.use("/uploads", express.static("uploads  "))
//connection with front:
server.use(cors());
server.use('*',cors());
server.use(express.json())

initconnection()
 
server.use(userRoutes)
server.use(categoryRoutes)
server.use(productsRoutes)
server.use(couponeRoutes)
server.use(cartRoutes)
server.use('/uploads', express.static('uploads'));






server.listen(5000)