import { Document, model, Model, Schema } from 'mongoose';

export interface CartDocument extends Document {
  user: Schema.Types.ObjectId;
  cartItems: Array<object>;
}

const CartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart: Model<CartDocument> = model('Cart', CartSchema);

export default Cart;
