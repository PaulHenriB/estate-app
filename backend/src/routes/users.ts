import { Router } from 'express';
import { getMyProfile, updateMyProfile, getMySavedListings, toggleSavedListing, generateTenantSummaryForUser } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes in this file are protected
router.use(authMiddleware);

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

router.get('/me/saved-listings', getMySavedListings);
router.post('/me/saved-listings/:listingId', toggleSavedListing);

router.post('/me/generate-summary', generateTenantSummaryForUser);


export default router;
