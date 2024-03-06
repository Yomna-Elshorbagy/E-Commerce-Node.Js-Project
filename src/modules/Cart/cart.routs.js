import express  from "express";
import { applyCoupon, createOrder, emptyCart, getUserCart, getUserOrder, updateCart, userCart } from "./controllers/cart.controllers.js";
import { auth } from "../../middleware/auth.js";

const cartRoutes = express.Router()

cartRoutes.post("/usercart",auth, userCart);
cartRoutes.get("/usercart",auth, getUserCart);
cartRoutes.delete("/usercart",auth, emptyCart);
cartRoutes.patch("/:cartId/:productIdToUpdate",auth, updateCart);
// cartRoutes.patch("/updateCart/:cartId",auth, updateCart);

cartRoutes.get("/userOrder",auth, getUserOrder);
cartRoutes.post("/usercart2",auth, applyCoupon);
cartRoutes.post("/createOrder",auth, createOrder);

export default cartRoutes;
