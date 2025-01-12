import { Product } from '@prisma/client';
import { cpuSpecs, gpuSpecs, monitorSpecs, motherBoardSpecs, ramSpecs } from '../../globals/types';

interface IProduct {
    createProduct(data: Omit<Product, 'id'>): Promise<number>;
    updateProduct(data: Omit<Product, 'id'>): Promise<number>;
    deleteProduct(): Promise<void>;
    getProductById(id: number): Promise<Product>;
    getAllProductsByCategory(category: string): Promise<Array<Product>>;
    searchProducts(data: Partial<Pick<Product, 'vendorId' | 'category' | 'isNew'>> & { minPrice?: number, maxPrice?: number, specs: cpuSpecs | ramSpecs | gpuSpecs | motherBoardSpecs | ramSpecs | monitorSpecs }): Promise<Array<Product>>;
}

export default IProduct