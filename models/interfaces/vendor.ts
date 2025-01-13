import { Vendor } from '@prisma/client';

interface IVendor {
  createVendor(data: Omit<Vendor, 'id'>): Promise<number>;
  updateVendor(id: number, data: Partial<Pick<Vendor, 'name' | 'address' | 'phone'>>): Promise<void>;
  deleteVendor(id: number): Promise<void>;
  getVendorById(id: number): Promise<void>;
  resetVendorPassword(id: number, password: string): Promise<void>;
  getVendorCount(email: string): Promise<number>;
}

export default IVendor;
