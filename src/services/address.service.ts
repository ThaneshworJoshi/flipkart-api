import { ObjectId } from 'mongoose';
import UserAddress from '../models/address.model';

/**
 * Get address by id
 * @param {ObjectId} userId
 * @returns {Promise<UserAddress>}
 */
export const getAddressById = async (userId: ObjectId) => {
  return await UserAddress.findById({ _id: userId });
};

/**
 * Get address by user id
 * @param {ObjectId} userId
 * @param {Promise<UserAddress>}
 */
export const getAddressByUserId = async (userId: ObjectId) => {
  return await UserAddress.findOne({ user: userId });
};

/**
 * Get address by user id
 * @param {ObjectId} userId
 * @param {object} addressObj
 * @param {Promise<UserAddress>}
 */
export const updateAddressByUserId = async (userId: ObjectId, addressObj: object) => {
  let address: any;
  if (addressObj.id) {
    address = await UserAddress.findOneAndUpdate(
      { user: userId, 'address._id': addressObj.id },
      {
        $set: {
          'address.$': addressObj,
        },
      },
      { new: true, upsert: true }
    );
  } else {
    address = await UserAddress.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          address: addressObj,
        },
      },
      { new: true, upsert: true }
    );
  }

  return address;
};
