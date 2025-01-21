import { Vendor } from '@prisma/client';

interface IVendor {
  createVendor(data: Omit<Vendor, 'id'>): Promise<number>;
  updateVendor(id: number, data: Partial<Pick<Vendor, 'name' | 'address' | 'phone'>>): Promise<void>;
  deleteVendor(id: number): Promise<void>;
  getVendorById(id: number): Promise<Vendor | null>;
  getVendorByEmail(email: string): Promise<Pick<Vendor, 'id' | 'password'> | null>;
  resetVendorPassword(id: number, password: string): Promise<void>;
  getVendorCount(id: number): Promise<number>;
  getVendorCount(email: string): Promise<number>;
  getVendorIdByProductId(productId: number): Promise<number | null>;
}

export default IVendor;
