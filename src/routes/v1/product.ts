import { Router } from 'express';
import {
  getProductDetailById,
  getProductInfoById,
  getProducts,
  getProductsByCatId,
} from '../../controllers/product.controller';

const router = Router();

router.route('/').get(getProducts);
router.route('/public').get(getProductsByCatId);
router.route('/:productId/public').get(getProductInfoById);
router.route('/:productId/details').get(getProductDetailById);

export default router;
