import { Router } from 'express';
import { createProduct, deleteProduct, updateProduct } from '../../../controllers/product.controller';
import { isAdmin, requireSignin } from '../../../middlewares/auth';
import { upload } from '../../../middlewares/common';

const router = Router();

router.route('/').post(upload.array('images'), createProduct).put(upload.array('productPictures'), updateProduct);

router.route('/:id').delete(deleteProduct);

// .post(requireSignin, isAdmin, upload.array('images'), createProduct)
// .put(requireSignin, isAdmin, upload.array('productPictures'), updateProduct)
// .delete(requireSignin, isAdmin, deleteProduct);

export default router;
