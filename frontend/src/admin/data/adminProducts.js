// Unified admin products bridge for legacy imports
import { initialProducts } from '../../data/initialProducts';
import { normalizeProduct } from '../../services/productService';

export const adminProducts = initialProducts.map(normalizeProduct);
export { initialProducts };
export default adminProducts;
