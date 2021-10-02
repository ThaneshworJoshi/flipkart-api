import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { validate } from '../utils/validation/joi';
import { categorySchema } from '../utils/validators/categoryBodySchema';
import { adCategoryService, categoryService } from '../services';
import Api404Error from '../errors/Api404Error';
import * as httpStatus from 'http-status-codes';
import { removeImage } from '../utils/helpers/removeFiles';
import { adCategoryCreateSchema } from '../utils/validators/adCategoryBodySchema';

/**
 * Create a category
 * @route POST /api/v1/category
 * @access Private/Admin
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, categorySchema);
  const {
    name,
    type,
    active,
    dispInHeader: shouldDispInHeader,
    parentId,
  } = req.body as {
    name: string;
    type: string;
    active: boolean;
    dispInHeader: boolean;
    parentId: any;
  };

  const slug: string = `${slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid()}`;

  const categoryObject = {
    name,
    slug,
    type,
    active,
    shouldDispInHeader,
  };

  if (req.file) {
    // @ts-ignore
    categoryObject.image = req.file.filename;
  }
  if (parentId) {
    // @ts-ignore
    categoryObject.parentId = parentId;
  }
  const category = await categoryService.createCategory(categoryObject);

  if (category) {
    return res.status(httpStatus.StatusCodes.CREATED).json({ success: true, data: category });
  }
  res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Cannot create category' });
});

/**
 * Get all categories
 * @route GET /api/v1/category
 * @access PUBLIC
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories({});
  if (categories) {
    return res.status(httpStatus.StatusCodes.OK).json({ success: true, data: categories });
  }
  res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Cannot get categories' });
});

/**
 * Delete category by id
 * @param {ObjectId} catId
 * @returns {Promise<Category>}
 */
export const deleteCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.body;
  const category = await categoryService.getCategoryById(categoryId);

  if (!category) {
    //TODO
    throw new Api404Error('category not found');
  }

  await category.remove();
  if (category.image) {
    removeImage(category.image);
  }

  res.status(httpStatus.StatusCodes.NO_CONTENT);
});

/**
 * Get all hpcategories
 * @param {Request} req
 * @param {Response} res
 */
export const getHomepageCategories = asyncHandler(async (req: Request, res: Response) => {
  const hpCategories = await categoryService.getHpCategories();

  res.status(httpStatus.StatusCodes.OK).json({ success: true, data: hpCategories });
});
