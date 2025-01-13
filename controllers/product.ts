import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Product, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

class ProductController {
  private db: ISqlServer;

  constructor(_db: ISqlServer) {
    this.db = _db;
  }

  create: RequestHandler<any, APIResponse, Omit<Product, 'id'>> = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1] as string;
    const obj = jwt.decode(token) as Pick<Vendor, 'id' | 'email'>;
    req.body.vendorId = obj.id;
    req.body.year = new Date(req.body.year);
    const id = await this.db.createProduct(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true });
  };
}

export default ProductController;
