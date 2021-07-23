import * as Joi from 'joi';

const title = Joi.string().min(4).max(240).required();
const rating = Joi.number().min(1).max(5).required();
const comment = Joi.string().required();
const userId = Joi.string().required();
const productId = Joi.string().required();
const reviewId = Joi.string().required();

export const createReviewSchema = Joi.object({
  title,
  rating,
  comment,
  userId,
  productId,
});

export const updateReviewSchema = Joi.object({
  reviewId,
  title,
  rating,
  comment,
  userId,
  productId,
});

export const deleteReviewSchema = Joi.object({
  reviewId,
});
