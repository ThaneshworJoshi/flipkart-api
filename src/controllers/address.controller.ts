import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import { addressService } from '../services';
import { validate } from '../utils/validation/joi';
import { addressSchema } from '../utils/validators/addressBodySchema';
import * as httpStatus from 'http-status-codes';

/**
 * Create a address
 * @route POST /api/v1/address/create
 * @access Public/User
 */
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  await validate({ ...req.body.address }, addressSchema);

  const addressObj = { ...req.body.address };
  const address = await addressService.updateAddressByUserId(req.user._id, addressObj);

  res.status(httpStatus.OK).json({ success: true, address });
});

/**
 * Get a address
 * @route POST /api/v1/address/
 * @access Public/User
 */
export const getAddress = asyncHandler(async (req: Request, res: Response) => {
  const address = await addressService.getAddressByUserId(req.user._id);
  if (address) {
    return res.status(httpStatus.OK).json({ success: true, address });
  } else {
    return res.status(httpStatus.OK).json({ success: true, message: 'No address found' });
  }
});
