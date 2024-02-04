import Joi from "joi";



export const addproductValidationSchema = Joi.object({
    productName: Joi.string().required(),
    slug: Joi.string(),
    ProductPrice: Joi.number().default(0).required(),
    priceAfterDiscount: Joi.number().required(),
    discount: Joi.number(),
    productImage: Joi.string().default(''),
    category:Joi.string().hex().min(24).max(24).required(),
    stock: Joi.number().default(0).min(0).max(100),
});

export const updateproductValidationSchema = Joi.object({ 
    productName: Joi.string().required(),
    discount: Joi.number(),
})