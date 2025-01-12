import { Customer, Order, Product, Product_Order } from '@prisma/client';

interface ICustomer {
  createCustomer(data: Omit<Customer, 'id'>): Promise<number>;
  updateCustomer(id: number, data: Partial<Pick<Customer, 'name' | 'address' | 'phone'>>): Promise<void>;
  updateCustomerPassword(id: number, password: string): Promise<void>;
  getCustomerById(id: number): Promise<Customer | null>;
  deleteCustomer(id: number): Promise<void>;
  getAllCustomers(): Promise<Array<Customer>>;
  getOrdersByCustomerId(id: number): Promise<Array<Order & { products: Array<Product_Order & { product: { name: string } }> }>>;
}

export default ICustomer;
