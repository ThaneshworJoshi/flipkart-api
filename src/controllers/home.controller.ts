import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/async';
import * as httpStatus from 'http-status-codes';
import { adCategoryService } from '../services';

/**
 * Get Homepage categories items, banner, ad categories/products, ads
 */
export const getHomepageItems = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = 1;
  const page: number = Number(req.query.pageNumber) || 1;
  const docCount = await adCategoryService.countAdCategoies();

  const adCategories = await adCategoryService.getAdCategories();

  res.status(httpStatus.OK).json({ adCategories, page, pages: Math.ceil(docCount / pageSize) });
});
