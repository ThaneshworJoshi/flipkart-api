import { FilterQuery, ObjectId } from 'mongoose';
import Api404Error from '../errors/Api404Error';
import Review, { ReviewDocument } from '../models/review.model';

/**
 * Create a user review
 * @param {object}reviewObject
 * @returns {Promise<Review>}
 */
export const createReview = async (reviewObject: object) => {
  const review = await Review.create(reviewObject);
  return review;
};

/**
 * Get review by id
 * @param reviewId
 * @returns {Promise<Review>}
 */
export const getReviewById = async (reviewId: ObjectId) => {
  return await Review.findById(reviewId);
};

/**
 * Create a user review
 * @param {ObjectId} reveiwId
 * @param {object} reviewObject
 * @returns {Promise<Review>}
 */
export const updateReview = async (reviewId: ObjectId, reviewObject: object) => {
  const review = await Review.findById(reviewId);
  if (review) {
    //@ts-ignore
    review.title = reviewObject.title;
    //@ts-ignore
    review.comment = reviewObject.comment;
    //@ts-ignore
    review.rating = reviewObject.rating;
    return review.save();
  }
  throw new Api404Error('Review not found ');
};

/**
 * Delete review by id
 * @param {ObjectId}reviewId
 * @returns {Promise<Review>}
 * TODO function name
 */
export const deleteReviewById = async (reviewId: ObjectId) => {
  const review = await Review.findById(reviewId);
  if (review) {
    return await review.remove();
  }
  //TODO
  throw new Api404Error('Review not found');
};

/**
 * Get reviews by query
 * @param {FilterQuery<ReviewDocument>} query
 * @returns {Promise<Review>}
 */
export const findReviews = async (query: FilterQuery<ReviewDocument>) => {
  return await Review.find(query);
};

/**
 * Get reviews by productId
 * @param {ObjectId} productId
 * @returns
 */
export const getReviewsByProductId = async (productId: ObjectId) => {
  return await Review.find({ productId }).populate({
    path: 'userId',
    select: 'name',
  });
};
