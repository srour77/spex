import { Vendor } from '@prisma/client';
import jwt from 'jsonwebtoken';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Roles } from '../globals/enums';

class VendorServices {
  private db: ISqlServer;

  constructor(_db: ISqlServer) {
    this.db = _db;
  }

  generateToken(vendor: Pick<Vendor, 'id' | 'email'>): string {
    return jwt.sign({ ...vendor, role: Roles.vendor }, String(process.env.JWT_SECRET), { expiresIn: '10 d' });
  }

  async vendorExists(email: string): Promise<boolean> {
    if ((await this.db.getVendorCount(email)) >= 1) return true;
    return false;
  }
}

export default VendorServices;
