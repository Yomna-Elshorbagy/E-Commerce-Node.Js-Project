import Joi from "joi";


export const addCategrySchema = Joi.object({
    categoryName: Joi.string().alphanum().min(3).max(25).required(),
    image: Joi.string().allow(''),
    createdBy: Joi.string().hex().min(24).max(24).required()
})

export const updateCategrySchema = Joi.object({
    categoryName: Joi.string().alphanum().min(3).max(25).required(),
    image: Joi.string().allow(''),
})