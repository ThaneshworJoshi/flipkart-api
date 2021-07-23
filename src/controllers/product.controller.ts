import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { nanoid } from 'nanoid';
import { asyncHandler } from '../middlewares/async';
import { productService } from '../services';
import { removeImages } from '../utils/helpers/removeFiles';
import { validate } from '../utils/validation/joi';
import { productSchema } from '../utils/validators/productBodySchema';
import * as httpStatus from 'http-status-codes';
import Api404Error from '../errors/Api404Error';
import Category from '../models/category.model';
import slugify from 'slugify';

/**
 * Create new product
 * @route POST /products
 * @param {Request} req
 * @param {Response} res
 * @access Private/Admin
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, productSchema);

  const { name, price, countInStock, description, category } = req.body as {
    name: string;
    price: number;
    countInStock: number;
    description: string;
    category: ObjectId;
  };

  const slug: string = `${slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid()}`;

  const productObject = {
    name,
    slug,
    price,
    countInStock,
    description,
    category,
    //createdBy: req.user.id
  };
  //@ts-ignore
  if (req.files?.length > 0) {
    let productImages = [];
    //@ts-ignore
    productImages = req.files?.map((file) => {
      return { img: file.filename };
    });
    //@ts-ignore
    productObject.productPictures = productImages;
  }

  const product = await productService.createProduct(productObject);

  if (product) {
    return res.status(httpStatus.StatusCodes.CREATED).json({ success: true, data: product });
  }
  // TODO
  throw new Error('Internal Server Error');
});

/**
 * Get products
 * @route POST /products
 * @param {Request} req
 * @param {Response} res
 * @access Public/Admin
 * */
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getProducts({});
  return res.status(httpStatus.StatusCodes.OK).json({ data: products });
});

/**
 * Get all products by categoryId
 * @route GET /products/:catId
 * @param {Request} req
 * @param {Response} res
 *
 */
export const getProductsByCatId = asyncHandler(async (req: Request, res: Response) => {
  let { catId } = req.params as {
    catId: string;
  };
  const category = await Category.findById(catId).select('_id type');

  if (category) {
    const products = await productService.getProductByCatId(category._id);
    if (products.length > 0) {
      if (category.type === 'list') {
        //TODO
        // const latestProducts = products
        return res.status(httpStatus.StatusCodes.OK).json({
          productsByPrice: {
            under5K: products.filter((p) => p.price <= 5000),
            under10k: products.filter((p) => p.price > 5000 && p.price <= 10000),
            under15k: products.filter((p) => p.price > 10000 && p.price <= 15000),
            under20k: products.filter((p) => p.price > 15000 && p.price <= 20000),
            above20k: products.filter((p) => p.price > 20000),
          },
        });
      } else if (category.type === 'store') {
        return res.status(httpStatus.StatusCodes.OK).json({
          //@ts-ignore
          products: products.sort((a, b) => (a.avgRating > b.avgRating ? -1 : 1)),
        });
      } else {
        return res.status(httpStatus.StatusCodes.OK).json({ products });
      }
    }
  }
  throw new Api404Error('Products Not Found');
});

/**
 * Get  product detail by product id
 * @route GET /products/:catId
 * @param {Request} req
 * @param {Response} res
 */
export const getProductDetailById = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params as {
    productId: string;
  };

  if (productId) {
    const product = await productService.getProductById(productId);

    if (product) {
      return res.status(httpStatus.StatusCodes.OK).json({ data: product });
    }
  }
  // TODO
  throw new Api404Error('Product Not Found');
});

/**
 * Delete a product
 * @route DELETE /products
 * @param {Request} req
 * @param {Response} res
 * @access Private/Admin
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id: any = req.params.id;

  const deletedProduct = await productService.deleteProductById(id);

  removeImages(deletedProduct.productPictures);

  res.status(httpStatus.StatusCodes.OK).json({ success: true, message: 'Product removed' });
});

/**
 * @description Update a product
 * @route PUT /products
 * @param {Request} req
 * @param {Response} res
 * @access Private/Admin
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  await validate(req.body, productSchema);

  const { productId, name, price, countInStock, description, category } = req.body as {
    productId: ObjectId;
    name: string;
    price: number;
    countInStock: number;
    description: string;
    category: ObjectId;
  };

  const slug: string = `${slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${nanoid()}`;

  const productObject = {
    name,
    slug,
    price,
    countInStock,
    description,
    category,
  };

  //@ts-ignore
  if (req.files?.length > 0) {
    let productImages = [];
    //@ts-ignore
    productImages = req.files?.map((file) => {
      return { img: file.filename };
    });
    //@ts-ignore
    productObject.productPictures = productImages;
  }

  const updatedProduct = await productService.updateProduct(productId, productObject);
  res.status(httpStatus.StatusCodes.OK).json({ success: true, data: updatedProduct });
});
