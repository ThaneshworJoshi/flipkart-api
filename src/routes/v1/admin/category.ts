import { Router } from 'express';
import { createCategory, deleteCategoryById } from '../../../controllers/category.controller';
import { isAdmin, requireSignin } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/common';

const router = Router();

router
  .route('/')
  .post(upload.single('image'), createCategory)
  // .post(requireSignin, isAdmin, upload.single('image'), createCategory)

  .delete(requireSignin, isAdmin, deleteCategoryById)
  //TODO
  .put(() => {});
// router.route('/').delete(deleteCategoryById);

export default router;
