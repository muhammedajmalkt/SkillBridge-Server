const Joi = require("joi")

exports.swapSchema = Joi.object({
    offeredTitle:Joi.string().min(20).required(),
    offeredCategory:Joi.string().required().lowercase(),
    offeredExpireince:Joi.string().required(),
    offeredDetails:Joi.string().required().min(20).max(500),
    // offeredImage:Joi.string(),

    neededTitle:Joi.string().required().min(20),
    neededCategory:Joi.string().required().lowercase(),
    neededPriority:Joi.string().required(),
    neededDetails:Joi.string().required().min(20).max(500),
    //  neededImage:Joi.string(),
     hours:Joi.number().min(1).max(14)

})