import { Router } from 'express';
import { getAdCategories, getAdCategoryProducts } from '../../controllers/adcategory.controller';
import { isUser, requireSignin } from '../../middlewares/auth';

const router = Router();

router.route('/').get(getAdCategories);
router.route('/products/:id').get(getAdCategoryProducts);

export default router;
