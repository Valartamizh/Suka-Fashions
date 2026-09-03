// Unified products bridge for legacy imports
import { initialProducts } from './initialProducts';
import { normalizeProduct } from '../services/productService';

export const products = initialProducts.map(normalizeProduct);
export { initialProducts };
export default products;
