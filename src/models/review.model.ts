import { Document, model, Model, ObjectId, Schema } from 'mongoose';
import logger from '../utils/logger';
// import Product from './product.model';

export interface ReviewDocument extends Document {
  title: string;
  rating: number;
  comment: string;
  likes: number;
  unLikes: number;
  userId: ObjectId;
  productId: ObjectId;
}

const ReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter title'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating bewteen 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
    likes: {
      type: Number,
    },
    unLikes: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Static function to update totalReviews adn averageRating in product document
 * @param {ObjectId} pId
 * @param {Number} incTotalReview
 */
ReviewSchema.statics.getRating = async function (pId) {
  const object = await this.aggregate([
    {
      $match: { productId: pId },
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  try {
    await model('Product').findByIdAndUpdate(
      { _id: pId },
      {
        $set: {
          avgRating: object[0].averageRating,
          totalReviews: object[0].count,
        },
      }
    );
  } catch (error) {
    logger.error(error.message);
  }
};

ReviewSchema.post('save', function () {
  //@ts-ignore
  this.constructor.getRating(this.productId);
});

ReviewSchema.pre('remove', function () {
  //@ts-ignore
  this.constructor.getRating(this.productId);
});

const Review: Model<ReviewDocument> = model('Review', ReviewSchema);
export default Review;
