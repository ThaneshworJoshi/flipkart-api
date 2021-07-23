import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import Api404Error from '../errors/Api404Error';
import { asyncHandler } from '../middlewares/async';
import * as httpStatus from 'http-status-codes';
import { adCategoryService } from '../services';
import { validate } from '../utils/validation/joi';
import {
  adCategoryCreateSchema,
  adCategoryUpdateSchema,
  adProductCreateSchema,
  adProuctUpdateSchema,
} from '../utils/validators/adCategoryBodySchema';

/**
 * Create adcategory
 * @param {Request} req
 * @param {Response} res
 */
export const createAdCategory = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, adCategoryCreateSchema);

  const { title, subtitle, priority } = req.body as {
    title: string;
    subtitle: string;
    priority: number;
  };

  const slug: string = `${slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid()}`;

  const adCatObject = {
    title,
    subtitle,
    slug,
    priority,
  };

  const adCategory = await adCategoryService.createAdCategory(adCatObject);

  if (adCategory) {
    return res.status(httpStatus.CREATED).json({ success: true, data: adCategory });
  }

  //TODO
  throw new Error('Internal Server Error');
});

/**
 * Update a adcategories
 * @param {Request} req
 * @param {Response} res
 */
export const updateAdCategory = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, adCategoryUpdateSchema);

  const { id, title, subtitle, priority } = req.body as {
    id: ObjectId;
    title: string;
    subtitle: string;
    priority: number;
  };

  const slug: string = `${slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid()}`;

  const adCatObject = {
    title,
    subtitle,
    slug,
    priority,
  };

  const adCategory = await adCategoryService.getAdCategoryById(id);
  if (adCategory) {
    const updatedAdCategory = await adCategoryService.updateAdCategory(id, adCatObject);
    return res.status(httpStatus.OK).json({ success: true, data: updatedAdCategory });
  }

  //TODO
  throw new Api404Error();
});

/**
 * Delete adcategories
 * @param {Request} req
 * @param {Response} res
 */
export const deleteAdCategory = asyncHandler(async (req: Request, res: Response) => {
  const adCatId: ObjectId = req.body.adCatId;
  await adCategoryService.deleteAdCategoryById(adCatId);

  //TODO
  res.status(httpStatus.OK).json({ success: true, message: 'AdCategory deleted successfully' });
});

/**
 * Add product to category
 * @param {Request} req
 * @param {Response} res
 */
export const addAdProduct = asyncHandler(async (req: Request, res: Response) => {
  validate(req.body, adProductCreateSchema);
  const { name, info, desc, categoryId, parentAdCategoryId } = req.body as {
    name: string;
    info: string;
    desc: string;
    categoryId: ObjectId;
    parentAdCategoryId: ObjectId;
  };

  let category: ObjectId = categoryId;

  const prodObject = {
    name,
    info,
    desc,
    category,
    image: 'dummy.jpg',
  };

  if (req.file) {
    //@ts-ignore
    prodObject.image = req.file.filename;
  }

  const addedProduct = await adCategoryService.addProduct(parentAdCategoryId, prodObject);

  res.status(httpStatus.CREATED).json({ success: true, data: addedProduct });
});
/**
 * Update product of category
 * @param {Request} req
 * @param {Response} res
 */
export const updateAdCategoryProduct = asyncHandler(async (req: Request, res: Response) => {
  validate(req.body, adProuctUpdateSchema);
  const { id, name, info, desc, categoryId, parentAdCategoryId } = req.body as {
    id: ObjectId;
    name: string;
    info: string;
    desc: string;
    categoryId: ObjectId;
    parentAdCategoryId: ObjectId;
  };

  //TODO
  let category: ObjectId = categoryId;
  const prodObject = {
    name,
    info,
    desc,
    category,
    image: '',
  };

  if (req.file) {
    //@ts-ignore
    prodObject.image = req.file.filename;
  }

  // const adProductCategory = await adCategoryService.findById(parentAdCategoryId);

  const addedProduct = await adCategoryService.updateProduct(parentAdCategoryId, id, prodObject);

  res.status(httpStatus.OK).json({ success: true, message: 'Product Updated successfully' });
});

/**
 * Remove product of category
 * @param {Request} req
 * @param {Response} res
 */
export const removeAdProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id, parentAdCategoryId } = req.body as {
    id: ObjectId;
    parentAdCategoryId: ObjectId;
  };

  await adCategoryService.deleteProductById(parentAdCategoryId, id);

  res.status(httpStatus.OK).json({ success: true, message: 'Product removed successfully' });
});

/**
 * Get all adcategories
 * @param {Request} req
 * @param {Response} res
 */
export const getAdCategories = asyncHandler(async (req: Request, res: Response) => {
  let page: number = Number(req.query.pageNumber);
  const adCategories = await adCategoryService.getAdCategories(page);
  const totalCategories = await adCategoryService.countAdCategoies();

  res.status(httpStatus.OK).json({ success: true, data: adCategories, totalCategories });
});
