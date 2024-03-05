import Joi from "joi";

export const addUserSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  age: Joi.number().min(15).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/))
    .required(),
  Cpassword: Joi.ref("password"),
  address: Joi.array(),
});

export const updateuservalidation = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  age: Joi.number().min(15).max(50).required(),
  email: Joi.string().email().required(),
});

// export const resetPasswordSchema = {
//   body: Joi.object()
//     .required()
//     .keys({
//       password: Joi.string()
//         .pattern(
//           new RegExp(
//             // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
//             /^[A-Z][a-z0-9]{3,8}$/
//           )
//         )
//         .required()
//         .messages({
//           "string.pattern.base":
//             "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",
//         }),
//       email: Joi.string().email().required(),
//     }),
//};

export const resetPasswordSchema ={
  body: Joi.object().required()
  .keys({
      password: Joi.string()
    .pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be strong',
    }),
      email: Joi.string().required()
  }),

}

// export  const updateuservalidation = Joi.object({
//     id:Joi.string().hex().min(24).max(24).required(),
//     userName: Joi.string().alphanum().min(3).max(20).required(),
// })

// export const updateuservalidation ={
//   body:Joi.object().required().keys({
//       userName:Joi.string().pattern(new RegExp(/^[A-Z][a-z]{3,8}/)).required(),
//       email:Joi.string().email()

//   })
//   }
