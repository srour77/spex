import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Product, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Roles } from '../globals/enums';

class ProductController {
  private db: ISqlServer;

  constructor(_db: ISqlServer) {
    this.db = _db;
  }

  create: RequestHandler<any, APIResponse & { productId?: number }, Omit<Product, 'id'>> = async (req, res, next) => {
    const { [Roles.vendor]: { id } } = res.locals
    req.body.vendorId = id;
    req.body.year = new Date(req.body.year);
    const productId = await this.db.createProduct(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true, productId });
  };

  update: RequestHandler<{ id: string }, APIResponse, Omit<Product, 'id'>> = async (req, res, next) => {
    const { [Roles.vendor]: { id } } = res.locals;
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid product id', success: false });
      return;
    }

    if(await this.db.getVendorIdByProductId(productId) !== id) { res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid product id', success: false }); return; }
    await this.db.updateProduct(productId, req.body);
    res.status(StatusCodes.OK).json({ message: 'success', success: true });
  };

  delete: RequestHandler<{ id: string }, APIResponse> = async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid product id', success: false });
      return;
    }
    await this.db.deleteProduct(productId);
    res.status(StatusCodes.OK).json({ message: 'success', success: true });
  };

  getById: RequestHandler<{ id: string }, APIResponse & { product?: Product | null }> = async (req, res, next) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid product id', success: false });
      return;
    }
    const product = await this.db.getProductById(productId);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, product });
  };

  getByVendorId: RequestHandler<{ id: string }, APIResponse & { products?: Array<Product> }> = async (req, res, next) => {
    const vendorId = parseInt(req.params.id);
    if (isNaN(vendorId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid product id', success: false });
      return;
    }
    const products = await this.db.getProductsByVendorId(vendorId);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, products });
  };

  getAllProducts: RequestHandler<any, APIResponse & { products: Array<Product> }> = async(req, res, next) => {
    const products = await this.db.getAllProducts();
    res.status(StatusCodes.OK).json({ message: 'success', success: true, products })
  }
}

export default ProductController;
