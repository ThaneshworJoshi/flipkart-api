import { Router } from 'express';
import { getProductDetailById, getProducts } from '../../controllers/product.controller';

const router = Router();

router.route('/').get(getProducts);
router.route('/:productId/details').get(getProductDetailById);

export default router;
