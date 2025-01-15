import { RequestHandler } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import { Customer, Vendor } from '@prisma/client';
import { APIResponse } from '../globals/types';
import { StatusCodes } from 'http-status-codes';
import { hash, compare } from 'bcrypt';
import CustomerServices from '../services/customer';

class CustomerController {
  private db: ISqlServer;
  private services: CustomerServices;

  constructor(_db: ISqlServer) {
    this.db = _db;
    this.services = new CustomerServices(_db);
  }

  getById: RequestHandler<{ id: string }, APIResponse & { customer?: Omit<Customer, 'id' | 'password'> }> = async (req, res, next) => {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'invalid customer id', success: false });
    }

    const customer = (await this.db.getCustomerById(customerId)) as Customer;
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

    if (!await compare(password, customer.password)) {
      res.status(StatusCodes.OK).json({ message: 'invalid email/password', success: false });
      return;
    }

    const token = this.services.generateToken(customer);
    res.status(StatusCodes.OK).json({ message: 'success', success: true, token });
  };
}

export default CustomerController;
