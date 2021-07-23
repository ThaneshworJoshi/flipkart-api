import * as Joi from 'joi';

const mobileNumber = Joi.string().required();
const pinCode = Joi.string().required();
const address = Joi.string().required();
const cityDistrictTown = Joi.string().required();
const state = Joi.string().required();
const landmark = Joi.string().required();
const alternatePhone = Joi.string();
const addressType = Joi.string().required();

export const addressSchema = Joi.object({
  mobileNumber,
  pinCode,
  address,
  cityDistrictTown,
  state,
  landmark,
  alternatePhone,
  addressType,
});
