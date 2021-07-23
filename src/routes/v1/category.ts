import { Router } from 'express';
import { getCategories, getHomepageCategories } from '../../controllers/category.controller';
import { getProductsByCatId } from '../../controllers/product.controller';
import { isAdmin, isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/:catId/products').get(getProductsByCatId);
router.route('/').get(getCategories);
router.route('/header').get(getHomepageCategories);

export default router;
