import express from 'express';
const router = express.Router();
import { getHomeProducts, getSearchResults, getSingleProduct, getProducts } from '../controllers/apiController';

router.get('/', getHomeProducts);

router.get('/search', getSearchResults);

router.get('/:id', getSingleProduct);

router.get('/category/:category', getProducts);

export default router;