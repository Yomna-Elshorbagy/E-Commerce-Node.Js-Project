

import Joi from "joi";

export const addcouponSchema = Joi.object({
    couponCode: Joi.string().min(3).max(20).required(),
    value: Joi.number().min(1),
    expireIn: Joi.date().required(),
})