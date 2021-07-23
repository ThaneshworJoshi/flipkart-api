import { Document, model, Model, ObjectId, Schema } from 'mongoose';

export interface OrderDocument extends Document {
  user: ObjectId;
  address: ObjectId;
  totalAmount: number;
  items: Array<object>;
  paymentStatus: string;
}

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'UserAddress.address',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        pruchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'refund'],
      required: true,
    },
  },
  { timestamps: true }
);

const Order: Model<OrderDocument> = model('Order', OrderSchema);
export default Order;
