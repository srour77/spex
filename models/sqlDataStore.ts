import { Vendor, Customer, Order, Product_Order, Product, PrismaClient, Prisma } from '@prisma/client';
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

  async getVendorCount(email: string): Promise<number> {
    const count = await this.db.vendor.count({ where: { email } });
    return count;
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
    await this.db.$transaction([this.db.product.update({ where: { id }, data })], { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.db.$transaction([this.db.product.update({ where: { id }, data: { isDeleted: true } })], { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async buyProducts(customerId: number, data: Array<Pick<Product, 'id' | 'stock'>>): Promise<void> {
    await this.db.$transaction(async(t) => {
      const products = new Map((await t.product.findMany({ where: { id: { in: data.map(d => d.id) } }, select: { id: true, stock: true, price: true } })).map(d => [d.id, { stock: d.stock, price: d.price }]))
      for(let p of data) {
        if(!products.has(p.id)) throw new Error('invalid product id')
        const currentStock = products.get(p.id)?.stock as number
        if(p.stock > currentStock) throw new Error('insufficiant stock')
        await t.product.update({ where: { id: p.id }, data: { stock: { decrement: p.stock } } })
      }
      
      await t.order.create({ data: { customerId, products: { createMany: { data: data.map(d => ({ price: products.get(d.id)?.price as number, productId: d.id, itemNo: d.stock })) } } } })
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { id } });
    return product;
  }

  async searchProducts(
    data: Partial<Pick<Product, 'vendorId' | 'isNew'>> &
      Pick<Product, 'category'> & {
        minPrice?: number;
        maxPrice?: number;
        specs: Partial<cpuSpecs> & Partial<ramSpecs> & Partial<gpuSpecs> & Partial<motherBoardSpecs> & Partial<driveSpecs> & Partial<monitorSpecs>;
      },
  ): Promise<Array<Product>> {
    const { vendorId, category, isNew, minPrice, maxPrice, specs } = data;
    let query = this.generateSpecsQuery(specs) + ` AND category = ${category} `;
    if (minPrice != undefined) query += ` AND price >= ${minPrice} `;
    if (maxPrice != undefined) query += ` AND price <= ${maxPrice} `;
    if (vendorId != undefined) query += ` AND vendorId <= ${vendorId} `;
    if (isNew != undefined) query += ` AND isNew = ${isNew ? 1 : 0} `;

    const products = (await this.db.$queryRaw`select * from product where ${query}`) as Array<Product>;
    return products;
  }

  generateSpecsQuery(
    specs: Partial<Pick<cpuSpecs, 'cores' | 'threads' | 'baseClock' | 'socket'>> &
      Partial<Pick<ramSpecs, 'size' | 'speed' | 'memoryType'>> &
      Partial<Pick<motherBoardSpecs, 'socket'>> &
      Partial<Pick<gpuSpecs, 'cores' | 'memoryType' | 'memorySize'>> &
      Partial<Pick<monitorSpecs, 'size' | 'panel' | 'refreshRate'>> &
      Partial<Pick<driveSpecs, 'size' | 'readSpeed' | 'writeSpeed'>>,
  ): string {
    const keys: (keyof typeof specs)[] = ['cores', 'threads', 'baseClock', 'socket', 'size', 'speed', 'memorySize', 'socket', 'cores', 'memoryType', 'memorySize', 'size', 'panel', 'refreshRate', 'size', 'readSpeed', 'writeSpeed'];
    const query = keys
      .map(k => {
        if (specs[k] !== undefined) return `JSON_VALUE(specs, $.${k}) = ${specs[k]}`;
      })
      .join(' AND ');

    return query;
  }

  generateCpuSpecsQuery(cpuSpecs: Partial<Pick<cpuSpecs, 'cores' | 'threads' | 'baseClock' | 'socket'>>): string {
    const { cores, threads, baseClock, socket } = cpuSpecs;
    const keys: (keyof typeof cpuSpecs)[] = ['cores', 'threads', 'baseClock', 'socket'];
    const query = keys
      .map(k => {
        if (cpuSpecs[k] !== undefined) return `JSON_VALUE(specs, $.${k}) = ${cpuSpecs[k]}`;
      })
      .join(' AND ');

    return query;
  }

  generateRamSpecsQuery(ramSpecs: Partial<Pick<ramSpecs, 'size' | 'speed' | 'memoryType'>>): string {
    const { size, speed, memoryType } = ramSpecs;
    const keys: (keyof typeof ramSpecs)[] = ['size', 'speed', 'memoryType'];
    const query = keys
      .map(k => `${k}=${ramSpecs[k]}`)
      .join('&')
      .toString();
    return query;
  }

  generateMotherBoardSpecsQuery(motherBoardSpecs: Partial<Pick<motherBoardSpecs, 'socket'>>): string {
    const { socket } = motherBoardSpecs;
    const keys: (keyof typeof motherBoardSpecs)[] = ['socket'];
    const query = keys
      .map(k => `${k}=${motherBoardSpecs[k]}`)
      .join('&')
      .toString();
    return query;
  }

  generateGpuSpecsQuery(gpuSpecs: Partial<Pick<gpuSpecs, 'cores' | 'memoryType' | 'memorySize'>>): string {
    const { cores, memorySize, memoryType } = gpuSpecs;
    const keys: (keyof typeof gpuSpecs)[] = ['cores', 'memoryType', 'memorySize'];
    const query = keys
      .map(k => `${k}=${gpuSpecs[k]}`)
      .join('&')
      .toString();
    return query;
  }

  generateMonitorSpecsQuery(monitorSpecs: Partial<Pick<monitorSpecs, 'size' | 'panel' | 'refreshRate'>>): string {
    const { size, panel, refreshRate } = monitorSpecs;
    const keys: (keyof typeof monitorSpecs)[] = ['size', 'panel', 'refreshRate'];
    const query = keys
      .map(k => `${k}=${monitorSpecs[k]}`)
      .join('&')
      .toString();
    return query;
  }

  generateDriveSpecsQuery(driveSpecs: Partial<Pick<driveSpecs, 'size' | 'readSpeed' | 'writeSpeed'> & { minReadSpeed?: number; maxReadSpeed?: number; minWriteSpeed?: number; maxWriteSpeed?: number }>): string {
    const { size, minReadSpeed, maxReadSpeed, minWriteSpeed, maxWriteSpeed } = driveSpecs;
    const keys: (keyof typeof driveSpecs)[] = ['size', 'readSpeed', 'writeSpeed'];

    const query = keys
      .map(k => {
        let subQuery = ``;
        if (k == 'readSpeed') {
          if (driveSpecs.minReadSpeed !== undefined) subQuery = `${k}>=${driveSpecs[k]}`;
          if (driveSpecs.maxReadSpeed !== undefined) subQuery = `${k}<=${driveSpecs[k]}`;
        } else if (k == 'writeSpeed') {
          if (driveSpecs.minWriteSpeed !== undefined) subQuery = `${k}>=${driveSpecs[k]}`;
          if (driveSpecs.maxWriteSpeed !== undefined) subQuery = `${k}<=${driveSpecs[k]}`;
        } else subQuery = `${k}=${driveSpecs[k]}`;

        return subQuery;
      })
      .join('&')
      .toString();
    return query;
  }

  async getProductsByVendorId(vendorId: number): Promise<Array<Product>> {
    const products = await this.db.product.findMany({ where: { vendorId } })
    return products
  }
}

export default SqlServerDataStore;
