import Joi from 'joi';

const listingSchema = Joi.object({
    listing : Joi.object(
        {
        title: Joi.string().min(3).max(30).required(),
        description: Joi.string().max(50).required(),
        price: Joi.number().integer().min(500).required(),
        location: Joi.string().required(),
        country: Joi.string().valid("India", "China", "USA", "France","Nepal", "Canada").required(),
        image: Joi.string().allow("",null),
    }).required()
});

export default listingSchema;