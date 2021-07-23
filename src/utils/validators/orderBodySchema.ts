import * as Joi from 'joi';

const address = Joi.string().required();
const totalAmount = Joi.string().required();
const items = Joi.any().required();
const paymentStatus = Joi.string().required();

export const orderSchema = Joi.object({
  address,
  totalAmount,
  items,
  paymentStatus,
});
