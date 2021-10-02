import { FilterQuery, ObjectId } from 'mongoose';
import Category, { CategoryDocument } from '../models/category.model';

/**
 * Create category
 * @param {object} categoryObject
 * @returns {Promise<Category>}
 */
export const createCategory = async (categoryObject: object) => {
  const category = await Category.create(categoryObject);
  return category;
};

/**
 * Get all categories
 * @param {FilterQuery<CategoryDocument>} query
 * @returns {Promise<Category>}
 */
export const getCategories = async (query: FilterQuery<CategoryDocument>) => {
  let categoryList = [];
  const categories = await Category.find(query);

  if (categories) {
    categoryList = createCategories(categories, null);
  }
  return categoryList;
};

/**
 * Create tree stracture for categories
 * @param {Array<CategoryDocument>} categories
 * @param {ObjectId} parentId
 * @returns {Array<CategoryDocument>} categoryList[]
 */
const createCategories = (categories: Array<CategoryDocument>, parentId: any) => {
  const categoryList: Array<CategoryDocument> | any = [];
  let category;

  if (parentId === null) {
    category = categories.filter((category) => category.parentId == undefined);
  } else {
    category = categories.filter((category) => category.parentId == parentId);
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      parentId: cat.parentId,
      children: createCategories(categories, cat._id),
    });
  }
  return categoryList;
};

/**
 * Get category by id
 * @param {ObjectId} catId
 * @returns {Promise<Category>}
 */
export const getCategoryById = async (catId: ObjectId) => {
  const category = await Category.findById({ _id: catId });
  return category;
};

/**
 * Get category by id
 * @param {ObjectId} catId
 * @returns {Promise<Category>}
 */
export const getHpCategories = async () => {
  return await Category.find({ shouldDispInHeader: true }).select('name slug image type');
};
