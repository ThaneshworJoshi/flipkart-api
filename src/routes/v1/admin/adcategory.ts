import { Router } from 'express';
import {
  createAdCategory,
  getAdCategories,
  updateAdCategory,
  deleteAdCategory,
  addAdProduct,
  updateAdCategoryProduct,
  removeAdProduct,
} from '../../../controllers/adcategory.controller';
import { isAdmin, requireSignin } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/common';

const router = Router();

router.route('/').get(getAdCategories).post(createAdCategory).put(updateAdCategory).delete(deleteAdCategory);
router
  .route('/products')
  .post(requireSignin, isAdmin, upload.single('image'), addAdProduct)
  .put(requireSignin, isAdmin, upload.single('image'), updateAdCategoryProduct)
  .delete(requireSignin, isAdmin, removeAdProduct);

export default router;
