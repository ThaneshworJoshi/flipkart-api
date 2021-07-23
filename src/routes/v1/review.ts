import { Router } from 'express';
import { getReview } from '../../controllers/review.controller';

const router = Router();

//TODO
router.route('/:reviewId').get(getReview);

export default router;
