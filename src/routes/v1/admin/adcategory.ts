import { Router } from 'express';
import {
  createAdCategory,
  getAdminAdCategories,
  updateAdCategory,
  deleteAdCategory,
  addAdProduct,
  updateAdCategoryProduct,
  removeAdProduct,
} from '../../../controllers/adcategory.controller';
import { isAdmin, requireSignin } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/common';

const router = Router();

// router.route('/').post(upload.single('image'), createAdCategory);
// router.route('/').get(getAdCategories).post(requireSignin, isAdmin, createAdCategory).put(requireSignin, isAdmin, updateAdCategory).delete(requireSignin, isAdmin, deleteAdCategory);
router
  .route('/admin')
  .get(getAdminAdCategories)
  .post(upload.single('image'), createAdCategory)
  .put(upload.single('image'), updateAdCategory)
  .delete(deleteAdCategory);
router
  .route('/products')
  .post(upload.single('image'), addAdProduct)
  .put(upload.single('image'), updateAdCategoryProduct)
  .delete(removeAdProduct);
// .post(requireSignin, isAdmin, upload.single('image'), addAdProduct)
// .put(requireSignin, isAdmin, upload.single('image'), updateAdCategoryProduct)
// .delete(requireSignin, isAdmin, removeAdProduct);

export default router;
