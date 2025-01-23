import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Customer, Order, Product, Product_Order, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import { hash, compare } from 'bcrypt';
import VendorServices from '../services/vendor';
import { Roles } from '../globals/enums';
import jwt from 'jsonwebtoken';

class VendorController {
  private db: ISqlServer;
  private services: VendorServices;

  constructor(_db: ISqlServer) {
    this.db = _db;
    this.services = new VendorServices(_db);
  }

  create: RequestHandler<any, APIResponse, Omit<Vendor, 'id'>> = async (req, res, next) => {
    if (await this.services.vendorExists(req.body.email)) {
      res.status(StatusCodes.OK).json({ message: 'vendor already exists', success: false });
      return;
    }
    req.body.password = await hash(req.body.password, 10);
    const id = await this.db.createVendor(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true });
  };

  login: RequestHandler<any, APIResponse & { token?: string }, Pick<Vendor, 'email' | 'password'>> = async (req, res, next) => {
    const { email, password } = req.body;
    const vendor = await this.db.getVendorByEmail(email);
    if (!vendor || !vendor.emailVerified) {
      res.status(StatusCodes.OK).json({ message: 'invalid/unverified email', success: false });
      return;
    }

    if (!(await compare(password, vendor.password))) {
      res.status(StatusCodes.OK).json({ message: 'invalid email/password', success: false });
      return;
    }

    const token = this.services.generateToken({ id: vendor.id, email });
    res.status(StatusCodes.OK).json({ message: 'success', success: true, token });
  };

  getProfile: RequestHandler<any, APIResponse & { vendor?: Omit<Vendor, 'id' | 'password'> }> = async (req, res, next) => {
    const {
      [Roles.vendor]: { id }
    } = res.locals;
    const vendor = (await this.db.getVendorById(id)) as Vendor;
    const formattedCustomer = { ...vendor, id: undefined, password: undefined };
    res.status(StatusCodes.OK).json({ message: 'success', success: true, vendor: formattedCustomer });
  };

  requestPasswordReset: RequestHandler<any, APIResponse, { email: string }> = async (req, res, next) => {
    if ((await this.db.getCustomersCount(req.body.email)) == 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid email', success: false });
      return;
    }
    const token = this.services.generateResetPasswordToken(req.body.email);
    res.status(StatusCodes.OK).json({ message: 'an email has been sent to you to rest your password', success: true });
  };

  resetPassword: RequestHandler<any, APIResponse, { password: string }, { token: string }> = async (req, res, next) => {
    jwt.verify(req.query.token, String(process.env.ResetPasswordSecret), async (err, decoded) => {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid token', success: true });
        return;
      }
      decoded = decoded as { email: string; role: Roles };
      if (decoded.role != Roles.vendor || (await this.db.getVendorCount(decoded.email)) == 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid email', success: true });
        return;
      }
      await this.db.resetVendorPassword(decoded.email, req.body.password);
      res.status(StatusCodes.OK).json({ message: 'password has been updated', success: true });
    });
  };

  getOders: RequestHandler<any, APIResponse & { orders: Array<Pick<Order, 'id'> & { customer: Pick<Customer, 'name' | 'email'> } & { products: Array<Pick<Product_Order, 'price' | 'itemNo'> & { product: Pick<Product, 'id' | 'name' | 'desc'> }> }> }> =
    async (req, res, next) => {
      const {
        [Roles.vendor]: { id }
      } = res.locals;
      const orders = await this.db.getOrdersByVendorId(id);
      res.status(StatusCodes.OK).json({ message: 'success', success: true, orders });
    };
}

export default VendorController;
