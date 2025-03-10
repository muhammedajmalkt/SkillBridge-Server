const Joi=require("joi")

exports.signupSchema = Joi.object({
    name:Joi.string().required().min(3).message({
         "string.min":"Name should be atleast 3 character",
         "any.required": "Name is required"
    }),
    email:Joi.string().required().lowercase().email(),
    password:Joi.string().required().min(6)
})

exports.loginSchema = Joi.object({
    email:Joi.string().required().lowercase().email(),
    password:Joi.string().required().min(6)
})