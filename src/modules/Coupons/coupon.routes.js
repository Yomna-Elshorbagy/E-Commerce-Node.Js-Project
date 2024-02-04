import express  from "express";
import { Createcoupon, deletedBy, getAllCoupons, updateCouponByname, updatedCoupon } from "./controllers/coupon.controllers.js";
import { adminAuth } from "../../middleware/auth.js";
import { addcouponSchema } from "./coupon.validation.js";
import { validation } from "../../middleware/validation.js";

const couponeRoutes = express.Router()



couponeRoutes.post("/Coupon",validation(addcouponSchema), adminAuth, Createcoupon)
couponeRoutes.post('/expire/:id',adminAuth, deletedBy )
couponeRoutes.get("/Coupon",adminAuth, getAllCoupons)
couponeRoutes.patch("/Coupon/:id",adminAuth, updatedCoupon)
couponeRoutes.patch("/Coupon2",adminAuth, updateCouponByname)


export default couponeRoutes;
