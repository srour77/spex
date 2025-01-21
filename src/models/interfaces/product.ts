import { Product } from '@prisma/client';
import { cpuSpecs, driveSpecs, gpuSpecs, keyboardSpecs, monitorSpecs, motherBoardSpecs, mouseSpecs, ramSpecs } from '../../globals/types';

interface IProduct {
  createProduct(data: Omit<Product, 'id'>): Promise<number>;
  updateProduct(id: number, data: Omit<Product, 'id'>): Promise<void>;
  deleteProduct(id: number): Promise<void>;
  getProductById(id: number): Promise<Product | null>;
  searchProducts(
    data: Partial<Pick<Product, 'vendorId' | 'isNew'>> &
      Pick<Product, 'category'> & {
        minPrice?: number;
        maxPrice?: number;
        specs: Partial<cpuSpecs> | Partial<ramSpecs> | Partial<gpuSpecs> | Partial<motherBoardSpecs> | Partial<driveSpecs> | Partial<monitorSpecs> | Partial<keyboardSpecs> | Partial<mouseSpecs>;
      }
  ): Promise<Array<Pick<Product, 'id' | 'name' | 'desc' | 'price' | 'stock' | 'isNew'>>>;
  getProductsByVendorId(vendorId: number): Promise<Array<Product>>;
  getAllProducts(): Promise<Array<Product>>;
  buyProducts(customerId: number, data: Array<Pick<Product, 'id' | 'stock'>>): Promise<void>;
  getProductsByName(name: string): Promise<Array<Pick<Product, 'id' | 'name' | 'price'>>>;
  getAllProductsByVendorId(vendorId: number): Promise<Array<Product>>;
}

export default IProduct;
