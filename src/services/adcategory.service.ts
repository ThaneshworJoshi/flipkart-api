import mongoose, { ObjectId } from 'mongoose';
import Api404Error from '../errors/Api404Error';
import AdCategory, { AdProductDocument } from '../models/adProduct.model';
import { removeImage } from '../utils/helpers/removeFiles';

/**
 * Create Adcategory
 * @param {object} adCategoryObject
 * @returns {Promise<AdCategory>}
 */
export const createAdCategory = async (adCategoryObject: object) => {
  return await AdCategory.create(adCategoryObject);
};

/**
 * Get AdCategory by id
 * @param {ObjectId} id
 * @returns {Promise<AdCategory>}
 */
export const getAdCategoryById = async (id: ObjectId) => {
  return await AdCategory.findById(id);
};

/**
 *Get all Adcategories
 * TODO
 * @returns {Promise[AdCategoryDocument]}
 */
export const getAdCategories = async (page = 1, pageSize = 2) => {
  return await AdCategory.find({}, { products: { $slice: 6 } })
    .populate('products.category', '_id name type')
    .limit(pageSize)
    .skip(pageSize * (page - 1));
};

/**
 *Get all Adcategories for admin
 * TODO
 * @returns {Promise[AdCategoryDocument]}
 */
export const getAdminAdCategories = async (page = 1, pageSize = 10) => {
  return await AdCategory.aggregate([
    {
      $project: {
        _id: '$_id',
        title: '$title',
        priority: '$priority',
        totalProudcts: { $size: '$products' },
      },
    },
  ])
    .limit(pageSize)
    .skip(pageSize * (page - 1));
};

/**
 * Get products by category id
 * @param {ObjectId} id
 * @returns {Promise<AdProductDocument>}
 * */
//TODO
export const getProductsByCategoryId = async (id: any) => {
  return await AdCategory.findById(id).select('_id products');
};

/**
 * Update AdCategory by id
 * @param {ObjectId} id
 * @param {object} adCategoryObj
 * @returns {Promise<AdCategoryDocument>}
 */
export const updateAdCategory = async (id: ObjectId, adCategoryObj: object) => {
  return await AdCategory.findByIdAndUpdate(id, adCategoryObj, { new: true });
};

/**
 * Delete AdCategory by id
 * @returns {Promise<Adcategory>}
 */
export const deleteAdCategoryById = async (catId: ObjectId) => {
  const adCategory = await AdCategory.findById(catId);

  if (adCategory) {
    return adCategory.remove();
  }
  throw new Api404Error('Ad Category not found');
};

/**
 * Add product to adcategory's products array
 * @param catId
 * @param product
 * @returns
 */
export const addProduct = async (catId: ObjectId, product: AdProductDocument) => {
  const category = await AdCategory.findById(catId);
  if (category) {
    // @ts-ignore
    category.products.push(product);
    return await category.save();
  }
  throw new Api404Error();
};

/**
 * Update category product
 * @param {ObjectId} catId
 * @param {ObjectId} productId
 * @param {object} product
 * @returns
 */
export const updateProduct = async (catId: ObjectId, productId: ObjectId, product: AdProductDocument) => {
  const category = await AdCategory.findById(catId);

  if (category) {
    const cat = await AdCategory.aggregate([
      { $match: { 'products._id': new mongoose.Types.ObjectId(String(productId)) } },
      { $unwind: '$products' },
      { $match: { 'products._id': new mongoose.Types.ObjectId(String(productId)) } },
    ]);

    removeImage(cat[0].products.image);

    return await AdCategory.updateOne(
      { _id: catId, 'products._id': productId },
      {
        $set: {
          'products.$.name': product.name,
          'products.$.info': product.info,
          'products.$.desc': product.desc,
          'products.$.category': product.category,
          'products.$.image': product.image,
        },
      }
    );
  }
  //TODO
  throw new Api404Error('');
};

/**
 * Delete category product
 * @param {ObjectId} catId
 * @param {ObjectId} productId
 * @returns
 */
export const deleteProductById = async (catId: ObjectId, productId: ObjectId) => {
  const category = await AdCategory.findById(catId);
  if (category) {
    return await AdCategory.updateOne({ _id: catId }, { $pull: { products: { _id: productId } } });
  }
  throw new Api404Error();
};

/**
 * Get document counts
 * @returns {Number}
 */
export const countAdCategoies = async () => {
  return await AdCategory.countDocuments({});
};

// /**
//  * Get products count by category id
//  * @param {ObjectId} id
//  * @returns {Number}
//  * */
// export const countProductsByCategoryId = async (id: ObjectId) => {
//   const category = await AdCategory.findById(id);
//   return category?.products.length;
// };
