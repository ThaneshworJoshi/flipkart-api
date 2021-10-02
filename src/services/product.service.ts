import { FilterQuery, ObjectId } from 'mongoose';
import Api404Error from '../errors/Api404Error';
import Product, { ProductDocument } from '../models/product.model';
import { removeImages } from '../utils/helpers/removeFiles';

/**
 * Create new product
 * @param {object}productObject
 * @returns {Promise<Product>}
 */
export const createProduct = async (productObject: object) => {
  const product = await Product.create(productObject);
  // console.log(proudct);
  return product;
};

/**
 * Get product by query
 * @param {object} query
 * @returns {Promise<Product>}
 */
export const getProducts = async (query: FilterQuery<ProductDocument>) => {
  const product = await Product.find(query)
    .select('name category countInStock status price, productPictures')
    .populate('category', 'name');
  return product;
};

/**
 * Get products by category id
 * @param {ObjectId} catId
 * @returns {Promise<Products>}
 */
export const getProductByCatId = async (catId: ObjectId, getCategory: boolean) => {
  if (getCategory)
    return await Product.find({ category: catId })
      .select('_id name slug price countInStock productPictures avgRating totalReviews')
      .populate('category', '_id name type');
  else
    return await Product.find({ category: catId }).select(
      '_id name slug price countInStock productPictures avgRating totalReviews'
    );
};

/**
 * Get product by id
 * @param {any} productId
 * @param {boolean} shouldGetDetail
 * @returns {Promise<Product>}
 */
export const getProductById = async (productId: any, shouldGetDetail = true) => {
  if (shouldGetDetail) return await Product.findById(productId);
  else return await Product.findById(productId).select('_id name productPictures price countInStock');
};

/**
 * Delete single product
 * @param productId
 * @returns
 */
export const deleteProductById = async (productId: ObjectId) => {
  const product = await Product.findById(productId);

  if (product) {
    return await product.remove();
  }
  //TODO
  throw new Error('Product not found');
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Promise<Product>}
 */
export const updateProduct = async (productId: ObjectId, productObject: object) => {
  //@ts-ignore
  const product = await Product.findById(productId);
  if (product) {
    removeImages(product.productPictures);
    const updatedProduct = await Product.findByIdAndUpdate(productId, productObject, { new: true });

    return updatedProduct;
  }
  throw new Api404Error('Product Not found');
};
