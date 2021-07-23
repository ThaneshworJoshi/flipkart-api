import { Document, model, Model, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  type: string;
  image: string;
  active: boolean;
  shouldDispInHeader?: boolean;
  parentId: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shouldDispInHeader: Boolean,
    type: String,
    image: String,
    active: Boolean,
    parentId: String,
  },
  { timestamps: true }
);

const Category: Model<CategoryDocument> = model('Category', CategorySchema);
export default Category;
