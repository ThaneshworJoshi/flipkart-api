import * as Joi from 'joi';

const id = Joi.string().required();
const title = Joi.string().min(2).max(240).required();
const subtitle = Joi.string();
const priority = Joi.number().min(1).max(5).required();
const name = Joi.string().min(3).max(120).required();
const info = Joi.string().min(3).max(120).required();
const desc = Joi.string().min(3).max(120).required();
const categoryId = Joi.string().required();
const parentAdCategoryId = Joi.string().required();

export const adCategoryCreateSchema = Joi.object({
  title,
  subtitle,
  priority,
});

export const adCategoryUpdateSchema = Joi.object({
  id,
  title,
  subtitle,
  priority,
});

export const adProductCreateSchema = Joi.object({
  name,
  info,
  desc,
  categoryId,
  parentAdCategoryId,
});

export const adProuctUpdateSchema = Joi.object({
  id,
  name,
  info,
  desc,
  categoryId,
  parentAdCategoryId,
});
