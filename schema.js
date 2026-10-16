import Joi from "joi";

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(1000).required(),
    price: Joi.number().integer().min(500).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string()
        .empty("")
        .default(
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        ),
      filename: Joi.string().empty("").default("listingName").optional(),
    }).default(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});

export { listingSchema, reviewSchema };
