import * as Joi from 'joi';

const name = Joi.string().min(2).max(240).required();
const type = Joi.string().allow(null, '');
const parentId = Joi.any();
const active = Joi.boolean().required();
const shouldDispInHeader = Joi.boolean();

export const categorySchema = Joi.object({
  name,
  type,
  parentId,
  active,
  shouldDispInHeader,
});
