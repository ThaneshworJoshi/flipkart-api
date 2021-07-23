import { Router } from 'express';
import userRoutes from './routes/v1/user/users';
import categoryRoutes from './routes/v1/admin/category';
import adCategoryRoutes from './routes/v1/admin/adcategory';
import publicCategoryRoutes from './routes/v1/category';
import productRoutes from './routes/v1/admin/product';
import publicProductRoutes from './routes/v1/product';
import reviewRoutes from './routes/v1/user/review';
import publicReviewRoutes from './routes/v1/review';
import cartRoutes from './routes/v1/cart';
import orderRoutes from './routes/v1/order';
import addressRoutes from './routes/v1/address';
import { getHomepageItems } from './controllers/home.controller';

const router = Router();

router.use('/adcategories', adCategoryRoutes);

router.use('/users', userRoutes);
router.use('/categories', publicCategoryRoutes, categoryRoutes);
router.use('/products', publicProductRoutes, productRoutes);
router.use('/review', publicReviewRoutes, reviewRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/address', addressRoutes);

router.use('/', getHomepageItems);

export default router;
