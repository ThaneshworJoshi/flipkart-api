import { Document, model, Model, ObjectId, Schema } from 'mongoose';

export interface AddressDocument extends Document {
  user: string;
  mobileNumber: string;
  pinCode: string;
  address: string;
  cityDistrictTown: string;
  state: string;
  landmark: string;
  alternatePhone: string;
  addressType: AddressType;
}

export interface UserAddressDocument extends Document {
  user: ObjectId;
  address: [AddressDocument];
}

enum AddressType {
  HOME = 'home',
  WORK = 'work',
}

const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  cityDistrictTown: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    min: 10,
    max: 100,
  },
  alternatePhone: {
    type: String,
  },
  addressType: {
    type: String,
    required: true,
    enum: [AddressType],
  },
});

const UserAddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: [AddressSchema],
  },

  { timestamps: true }
);

const UserAddress: Model<UserAddressDocument> = model('UserAddress', UserAddressSchema);
export default UserAddress;
