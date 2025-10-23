import { Router } from 'express';
// FIX: Import new controller function for explaining matches
import { getAllListings, getListingById, explainMatch } from '../controllers/listingController';

const router = Router();

router.get('/', getAllListings);
router.get('/:id', getListingById);
// FIX: Add new route for generating match explanations
router.post('/:id/explain-match', explainMatch);


export default router;
