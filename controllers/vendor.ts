import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import { hash, compare } from 'bcrypt';
import VendorServices from '../services/vendor';

class VendorController {
  private db: ISqlServer;
  private services: VendorServices;

  constructor(_db: ISqlServer) {
    this.db = _db;
    this.services = new VendorServices(_db);
  }

  create: RequestHandler<any, APIResponse & { token?: string }, Omit<Vendor, 'id'>> = async (req, res, next) => {
    if (await this.services.vendorExists(req.body.email)) {
      res.status(StatusCodes.OK).json({ message: 'vendor already exists', success: false });
      return;
    }
    req.body.password = await hash(req.body.password, 10);
    const id = await this.db.createVendor(req.body);
    const token = this.services.generateToken({ id, email: req.body.email });
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true, token });
  };
}

export default VendorController;
