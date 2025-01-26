import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Customer, Order, Product, Product_Order, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import { hash, compare } from 'bcrypt';
import CustomerServices from '../services/customer';
import { Roles } from '../globals/enums';
import jwt from 'jsonwebtoken';
import { cities, governorates } from '../data';

class CustomerController {
  private db: ISqlServer;
  private services: CustomerServices;

  constructor(_db: ISqlServer) {
    this.db = _db;
    this.services = new CustomerServices(_db);
  }

  getProfile: RequestHandler<any, APIResponse & { customer?: Omit<Customer, 'id' | 'password'> }> = async (req, res, next) => {
    const {
      [Roles.customer]: { id }
    } = res.locals;
    const customer = (await this.db.getCustomerById(id)) as Customer;
    const formattedCustomer = { ...customer, id: undefined, password: undefined };
    res.status(StatusCodes.OK).json({ message: 'success', success: true, customer: formattedCustomer });
  };

  create: RequestHandler<any, APIResponse, Omit<Customer, 'id' | 'address'> & { address?: any }> = async (req, res, next) => {
    const { password, address } = req.body;
    if (await this.services.customerExists(req.body.email)) {
      res.status(StatusCodes.OK).json({ message: 'customer already exists', success: false });
      return;
    }
    req.body.password = await hash(password, 10);
    let data = req.body;
    if (address) {
      req.body.address.governorate = governorates[address.governorate]['governorate_name_ar'];
      req.body.address.city = cities[address.city]['city_name_ar'];
      data.address = JSON.stringify(req.body.address);
    }

    await this.db.createCustomer(data);
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true });
  };

  login: RequestHandler<any, APIResponse & { token?: string }, Pick<Customer, 'email' | 'password'>> = async (req, res, next) => {
    const { email, password } = req.body;
    const customer = await this.db.getCustomerByEmail(email);
    if (!customer || !customer.emailVerified) {
      res.status(StatusCodes.OK).json({ message: 'invalid/unverified email', success: false });
      return;
    }

    if (!(await compare(password, customer.password))) {
      res.status(StatusCodes.OK).json({ message: 'invalid email/password', success: false });
      return;
    }

    const token = this.services.generateToken(customer);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, token });
  };

  getAllOrders: RequestHandler<any, APIResponse & { orders: Array<Pick<Order, 'id'> & { products: Array<Pick<Product_Order, 'price' | 'itemNo'> & { product: Pick<Product, 'id' | 'name' | 'desc'> }> }> }> = async (req, res, next) => {
    const {
      [Roles.customer]: { id }
    } = res.locals;
    const orders = await this.db.getAllOrdersByCustomerId(id);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, orders });
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
      if (decoded.role != Roles.customer || (await this.db.getCustomersCount(decoded.email)) == 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid email', success: true });
        return;
      }
      await this.db.updateCustomerPassword(decoded.email, req.body.password);
      res.status(StatusCodes.OK).json({ message: 'password has been updated', success: true });
    });
  };
}

export default CustomerController;
