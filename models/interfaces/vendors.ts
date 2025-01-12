import { Vendor } from "@prisma/client"

interface IVendor {
    createVendor(): Promise<number>;
    updateVendor(data: Partial<Pick<Vendor, 'name' | 'address' | 'phone'>>): Promise<void>;
    deleteVendor(id: number): Promise<void>;
    getVendorById(id: number): Promise<void>;
    resetVendorPassword(id: number, password: string): Promise<void>;
}

export default IVendor