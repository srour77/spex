import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Customer, Order, Product, Product_Order, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import { hash, compare } from 'bcrypt';
import CustomerServices from '../services/customer';
import { Roles } from '../globals/enums';
import PaymentHandler from '../services/payment';

class CustomerController {
  private db: ISqlServer;
  private services: CustomerServices;

  constructor(_db: ISqlServer) {
    this.db = _db;
    this.services = new CustomerServices(_db);
  }

  getProfile: RequestHandler<any, APIResponse & { customer?: Omit<Customer, 'id' | 'password'> }> = async (req, res, next) => {
    const { [Roles.customer]: { id } } = res.locals;
    const customer = await this.db.getCustomerById(id) as Customer;
    const formattedCustomer = { ...customer, id: undefined, password: undefined };
    res.status(StatusCodes.OK).json({ message: 'success', success: true, customer: formattedCustomer });
  };

  create: RequestHandler<any, APIResponse & { token?: string }, Omit<Vendor, 'id'>> = async (req, res, next) => {
    if (await this.services.customerExists(req.body.email)) {
      res.status(StatusCodes.OK).json({ message: 'vendor already exists', success: false });
      return;
    }
    req.body.password = await hash(req.body.password, 10);
    const id = await this.db.createCustomer(req.body);
    const token = this.services.generateToken({ id, email: req.body.email });
    res.status(StatusCodes.CREATED).json({ message: 'success', success: true, token });
  };

  login: RequestHandler<any, APIResponse & { token?: string }, Pick<Customer, 'email' | 'password'>> = async (req, res, next) => {
    const { email, password } = req.body;
    const customer = await this.db.getCustomerByEmail(email);
    if (!customer) {
      res.status(StatusCodes.OK).json({ message: 'invalid email', success: false });
      return;
    }

    if (!(await compare(password, customer.password))) {
      res.status(StatusCodes.OK).json({ message: 'invalid email/password', success: false });
      return;
    }

    const token = this.services.generateToken(customer);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, token });
  };

  getAllOrders: RequestHandler<any, APIResponse & { orders: Array<Pick<Order, 'id'> & { products: Array<Pick<Product_Order, 'productId' | 'price' | 'itemNo'> & { product: Pick<Product, 'name' | 'desc'>  }> }> }> = async(req, res, next) => {
    const { [Roles.customer]: { id } } = res.locals;
    const orders = await this.db.getAllOrdersByCustomerId(id);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, orders });
  }
}

export default CustomerController;
