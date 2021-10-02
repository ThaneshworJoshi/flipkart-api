import * as Joi from 'joi';

const productId = Joi.string().required();
const name = Joi.string().min(2).max(240).required();
const price = Joi.number().required();
const countInStock = Joi.number().required();
const description = Joi.string().required();
const category = Joi.string().required();
const brand = Joi.string();
const highlights = Joi.array().items(Joi.string());
export const productSchema = Joi.object({
  name,
  price,
  countInStock,
  description,
  category,
  brand,
  highlights,
});
