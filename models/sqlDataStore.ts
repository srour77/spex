import { Vendor, Customer, Order, Product_Order, Product, PrismaClient } from '@prisma/client';
import { cpuSpecs, ramSpecs, gpuSpecs, motherBoardSpecs, driveSpecs, monitorSpecs, keyboardSpecs, mouseSpecs } from '../globals/types';
import ISqlServer from './interfaces/ISqlServer';

class SqlServerDataStore implements ISqlServer {
  db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async createVendor(data: Omit<Vendor, 'id'>): Promise<number> {
    const vendor = await this.db.vendor.create({ data, select: { id: true } });
    return vendor.id;
  }

  async updateVendor(id: number, data: Partial<Pick<Vendor, 'name' | 'address' | 'phone'>>): Promise<void> {
    await this.db.vendor.update({ where: { id }, data });
  }

  async deleteVendor(id: number): Promise<void> {
    await this.db.vendor.delete({ where: { id } });
  }

  async getVendorById(id: number): Promise<void> {
    await this.db.vendor.findFirst({ where: { id } });
  }

  async resetVendorPassword(id: number, password: string): Promise<void> {
    await this.db.vendor.update({ where: { id }, data: { password } });
  }

  async createCustomer(data: Omit<Customer, 'id'>): Promise<number> {
    const customer = await this.db.customer.create({ data, select: { id: true } });
    return customer.id;
  }

  async updateCustomer(id: number, data: Partial<Pick<Customer, 'name' | 'address' | 'phone'>>): Promise<void> {
    await this.db.customer.update({ where: { id }, data });
  }

  async updateCustomerPassword(id: number, password: string): Promise<void> {
    await this.db.customer.update({ where: { id }, data: { password } });
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    const customer = await this.db.customer.findFirst({ where: { id } });
    return customer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.db.customer.delete({ where: { id } });
  }

  async getAllCustomers(): Promise<Array<Customer>> {
    const customers = await this.db.customer.findMany();
    return customers;
  }

  async getOrdersByCustomerId(id: number): Promise<Array<Order & { products: Array<Product_Order & { product: { name: string } }> }>> {
    const orders = await this.db.order.findMany({
      where: { customerId: id },
      select: {
        id: true,
        customerId: true,
        products: {
          select: { price: true, itemNo: true, orderId: true, productId: true, product: { select: { name: true } } },
        },
      },
    });
    return orders;
  }

  async createProduct(data: Omit<Product, 'id'>): Promise<number> {
    const product = await this.db.product.create({ data, select: { id: true } });
    return product.id;
  }

  async updateProduct(id: number, data: Omit<Product, 'id'>): Promise<void> {
    await this.db.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.db.product.update({ where: { id }, data: { isDeleted: true } });
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { id } });
    return product;
  }

  async searchProducts(
    data: Partial<Pick<Product, 'vendorId' | 'category' | 'isNew'>> & {
      minPrice?: number;
      maxPrice?: number;
      specs: cpuSpecs | ramSpecs | gpuSpecs | motherBoardSpecs | driveSpecs | monitorSpecs | keyboardSpecs | mouseSpecs | undefined;
    },
  ): Promise<Array<Product>> {
    const { vendorId, category, isNew, minPrice, maxPrice, specs } = data
    let priceFilter: { gte?: number, lte?: number } = {}
    if(minPrice) priceFilter.gte = minPrice
    if(minPrice) priceFilter.lte = maxPrice
    
    const products = await this.db.product.findMany({ where: { isDeleted: false, vendorId, category, isNew, price: priceFilter } });
    return products;
  }

  generateSpecsQuery(specs: Partial<Pick<cpuSpecs, 'cores' | 'threads' | 'baseClock' | 'socket'>> & Partial<Pick<ramSpecs, 'size' | 'speed' | 'memoryType'>> & Partial<Pick<motherBoardSpecs, 'socket'>> & Partial<Pick<gpuSpecs, 'cores' | 'memoryType' | 'memorySize'>> & Partial<Pick<monitorSpecs, 'size' | 'panel' | 'refreshRate'>> & Partial<Pick<driveSpecs, 'size' | 'readSpeed' | 'writeSpeed'>>): string {
    const keys: (keyof typeof specs)[] = ['cores', 'threads', 'baseClock', 'socket', 'size', 'speed', 'memorySize', 'socket', 'cores', 'memoryType', 'memorySize', 'size', 'panel', 'refreshRate', 'size', 'readSpeed', 'writeSpeed'];
    const query = keys.map(k => `${k}=${specs[k]}`).join('&').toString();
    return query
  }

  generateCpuSpecsQuery(cpuSpecs: Partial<Pick<cpuSpecs, 'cores' | 'threads' | 'baseClock' | 'socket'>>): string {
    const { cores, threads, baseClock, socket } = cpuSpecs;
    const keys: (keyof typeof cpuSpecs)[] = ['cores', 'threads', 'baseClock', 'socket'];
    const query = keys.map(k => `${k}=${cpuSpecs[k]}`).join('&').toString();
    return query;
  }

  generateRamSpecsQuery(ramSpecs: Partial<Pick<ramSpecs, 'size' | 'speed' | 'memoryType'>>): string {
    const { size, speed, memoryType } = ramSpecs;
    const keys: (keyof typeof ramSpecs)[] = ['size', 'speed', 'memoryType'];
    const query = keys.map(k => `${k}=${ramSpecs[k]}`).join('&').toString();
    return query;
  }

  generateMotherBoardSpecsQuery(motherBoardSpecs: Partial<Pick<motherBoardSpecs, 'socket'>>): string {
    const { socket } = motherBoardSpecs;
    const keys: (keyof typeof motherBoardSpecs)[] = ['socket'];
    const query = keys.map(k => `${k}=${motherBoardSpecs[k]}`).join('&').toString();
    return query;
  }

  generateGpuSpecsQuery(gpuSpecs: Partial<Pick<gpuSpecs, 'cores' | 'memoryType' | 'memorySize'>>): string {
    const { cores, memorySize, memoryType } = gpuSpecs;
    const keys: (keyof typeof gpuSpecs)[] = ['cores', 'memoryType', 'memorySize'];
    const query = keys.map(k => `${k}=${gpuSpecs[k]}`).join('&').toString();
    return query;
  }

  generateMonitorSpecsQuery(monitorSpecs: Partial<Pick<monitorSpecs, 'size' | 'panel' | 'refreshRate'>>): string {
    const { size, panel, refreshRate } = monitorSpecs;
    const keys: (keyof typeof monitorSpecs)[] = ['size', 'panel', 'refreshRate'];
    const query = keys.map(k => `${k}=${monitorSpecs[k]}`).join('&').toString();
    return query;
  }

  generateDriveSpecsQuery(driveSpecs: Partial<Pick<driveSpecs, 'size' | 'readSpeed' | 'writeSpeed'> & { minReadSpeed?: number, maxReadSpeed?: number, minWriteSpeed?: number, maxWriteSpeed?: number }>): string {
    const { size, minReadSpeed, maxReadSpeed, minWriteSpeed, maxWriteSpeed } = driveSpecs;
    const keys: (keyof typeof driveSpecs)[] = ['size', 'readSpeed', 'writeSpeed'];

    const query = keys.map(k => {
        let subQuery = ``
        if(k == 'readSpeed') {
            if(driveSpecs.minReadSpeed !== undefined) subQuery = `${k}>=${driveSpecs[k]}`
            if(driveSpecs.maxReadSpeed !== undefined) subQuery = `${k}<=${driveSpecs[k]}`
        }
        else if(k == 'writeSpeed') {
            if(driveSpecs.minWriteSpeed !== undefined) subQuery = `${k}>=${driveSpecs[k]}`
            if(driveSpecs.maxWriteSpeed !== undefined) subQuery = `${k}<=${driveSpecs[k]}`
        }
        else subQuery = `${k}=${driveSpecs[k]}`

        return subQuery
    }).join('&').toString();
    return query;
  }
}

export default SqlServerDataStore;