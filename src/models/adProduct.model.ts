import { Document, model, Model, Schema } from 'mongoose';

export interface AdProductDocument {
  name: string;
  info: string;
  desc: string;
  image: string;
  category: Schema.Types.ObjectId;
}

export interface AdCategoryDocument {
  title: string;
  slug: string;
  subtitle?: string;
  products: Array<AdProductDocument>;
}

enum PRIORITY {
  V_HIGH = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
  V_LOW = 5,
}

const AdProductSchema = new Schema<AdProductDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    info: {
      type: String,
      trim: true,
      required: true,
    },
    desc: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      //Todo check
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

const AdCategorySchema = new Schema<AdCategoryDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    products: {
      type: [AdProductSchema],
    },
    priority: {
      type: PRIORITY,
      rquired: true,
    },
  },
  { timestamps: true }
);

const AdCategory: Model<AdCategoryDocument> = model('AdCategory', AdCategorySchema);
export default AdCategory;
