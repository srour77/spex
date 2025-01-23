import { Customer, Order, Product, Product_Order, Vendor } from '@prisma/client';

interface IVendor {
  createVendor(data: Omit<Vendor, 'id'>): Promise<number>;
  updateVendor(id: number, data: Partial<Pick<Vendor, 'name' | 'address' | 'phone'>>): Promise<void>;
  deleteVendor(id: number): Promise<void>;
  getVendorById(id: number): Promise<Vendor | null>;
  getVendorByEmail(email: string): Promise<Pick<Vendor, 'id' | 'password' | 'email' | 'emailVerified'> | null>;
  resetVendorPassword(id: number, password: string): Promise<void>;
  resetVendorPassword(email: string, password: string): Promise<void>;
  getVendorCount(id: number): Promise<number>;
  getVendorCount(email: string): Promise<number>;
  getVendorIdByProductId(productId: number): Promise<number | null>;
  getOrdersByVendorId(id: number): Promise<Array<Pick<Order, 'id'> & { customer: Pick<Customer, 'name' | 'email'> } & { products: Array<Pick<Product_Order, 'price' | 'itemNo'> & { product: Pick<Product, 'id' | 'name' | 'desc'>  }> }>>;
}

export default IVendor;
