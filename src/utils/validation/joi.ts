import * as Joi from 'joi';
import ValidationError from '../../errors/ValidationError';

/**
 * Validates a given schema against predefined schema
 * @param {object} payload
 * @param {object} schema
 * @returns {Promise<object>}
 */
export const validate = async (payload: object, schema: Joi.ObjectSchema) => {
  return new Promise((resolve, reject) => {
    const options = { abortEarly: false, stripUnknown: true };
    const { error, value } = schema.validate(payload, options);

    if (error) {
      reject(error);
      return;
    }
    resolve(value);
  });
};
