import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import Api404Error from '../errors/Api404Error';
import { asyncHandler } from '../middlewares/async';
import { reviewService, productService } from '../services';
import { validate } from '../utils/validation/joi';
import { createReviewSchema, updateReviewSchema, deleteReviewSchema } from '../utils/validators/reviewBodySchema';
import * as httpStatus from 'http-status-codes';

/**
 * Create a product review
 * @param {Request} req
 * @param {Response} res
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, createReviewSchema);

  const { productId, userId, title, comment, rating } = req.body as {
    productId: ObjectId;
    userId: ObjectId;
    title: string;
    comment: string;
    rating: number;
  };

  const reviewObject = {
    title,
    comment,
    rating,
    productId,
    userId,
  };

  const review = await reviewService.createReview(reviewObject);
  return res.status(httpStatus.OK).json({ success: true, data: review });
});

/**
 * Get a review
 * @param {Request} req
 * @param {Response} res
 * TODO
 */
export const getReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId: any = req.params.reviewId;
  if (reviewId) {
    const review = await reviewService.getReviewById(reviewId);
    if (!review) {
      throw new Api404Error(`Product not found with id of ${reviewId}`);
    }

    return res.status(httpStatus.OK).json({ success: true, data: review });
  }
  //TODO
  throw new Api404Error(`Review not found with id of ${reviewId}`);
});

/**
 * Get a product review
 * @param {Request} req
 * @param {Response} res
 * TODO
 */
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const productId: any = req.query.productId;
  console.log(productId);
  if (productId) {
    const product = await productService.getProductById(productId);
    if (!product) {
      throw new Api404Error(`Product not found with id of ${productId}`);
    }

    const productReviews = await reviewService.getReviewsByProductId(productId);

    return res.status(httpStatus.OK).json({
      success: true,
      count: productReviews.length,
      data: productReviews,
    });
  }
  //TODO
  throw new Api404Error(`Product not found with id of ${productId}`);
});

/**
 * Delete a product review
 * @param {Request} req
 * @param {Response} res
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, deleteReviewSchema);
  const { reviewId } = req.body as { reviewId: ObjectId };
  await reviewService.deleteReviewById(reviewId);
  return res.status(httpStatus.NO_CONTENT).json({ success: true, message: 'Review removed successfully' });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, updateReviewSchema);

  const { reviewId, productId, userId, title, comment, rating } = req.body as {
    reviewId: ObjectId;
    productId: ObjectId;
    userId: ObjectId;
    title: string;
    comment: string;
    rating: number;
  };

  const reviewObject = {
    title,
    comment,
    rating,
    productId,
    userId,
  };

  const review = await reviewService.updateReview(reviewId, reviewObject);
  return res.status(httpStatus.OK).json({ success: true, data: review });
});
