import { Document, model, Model, Schema } from 'mongoose';
import Review, { ReviewDocument } from './review.model';

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  price: number;
  countInStock: number;
  description: string;
  brand?: string;
  productPictures: Array<object>;
  category: Schema.Types.ObjectId;
  totalReviews: number;
  color?: string;
  offers?: Array<string>;
  highlights?: Array<string>;
  specifications?: Array<object>;
  status: boolean;
  updatedAt: Date;
  createdBy: Schema.Types.ObjectId;
}

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
    },
    productPictures: [{ img: { type: String } }],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    avgRating: {
      type: Number,
      required: true,
      default: 0,
    },
    totalReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
    },
    offers: [String],
    highlights: [String],
    specifications: {
      type: [{ String }],
    },
    status: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      //TODO
      // required: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ productId: this._id });
  next();
});

ProductSchema.virtual('Reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  justOne: false,
});

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) {
    delete ret._id;
  },
});

const Product: Model<ProductDocument> = model('Product', ProductSchema);
export default Product;
