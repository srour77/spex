import { Vendor, Customer, Order, Product_Order, Product, PrismaClient, Prisma } from '@prisma/client';
import { cpuSpecs, ramSpecs, gpuSpecs, motherBoardSpecs, driveSpecs, monitorSpecs, keyboardSpecs, mouseSpecs } from '../globals/types';
import ISqlServer from './interfaces/ISqlServer';
import PaymentHandler from '../services/payment';
import CustomError from '../errors/customError';
import { StatusCodes } from 'http-status-codes';

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

  async getVendorById(id: number): Promise<Vendor | null> {
    const vendor = await this.db.vendor.findFirst({ where: { id } });
    return vendor;
  }

  resetVendorPassword(id: number, password: string): Promise<void>;
  resetVendorPassword(email: string, password: string): Promise<void>;
  async resetVendorPassword(arg: number | string, password: string): Promise<void> {
    if(typeof arg === 'number') await this.db.vendor.update({ where: { id: arg }, data: { password } });
    else if(typeof arg === 'string') await this.db.vendor.update({ where: { email: arg }, data: { password } });
  }

  getVendorCount(id: number): Promise<number>;
  getVendorCount(email: string): Promise<number>;
  async getVendorCount(arg: number | string): Promise<number> {
    let count
    if(typeof arg == 'string') count = await this.db.vendor.count({ where: { email: arg } });
    else count = await this.db.vendor.count({ where: { id: arg } })
    return count;
  }

  async getVendorByEmail(email: string): Promise<Pick<Vendor, 'id' | 'password' | 'email' | 'emailVerified'> | null> {
    const vendor = await this.db.vendor.findFirst({ where: { email }, select: { id: true, password: true, email: true, emailVerified: true } });
    return vendor;
  }

  async createCustomer(data: Omit<Customer, 'id'>): Promise<number> {
    const customer = await this.db.customer.create({ data, select: { id: true } });
    return customer.id;
  }

  async updateCustomer(id: number, data: Partial<Pick<Customer, 'name' | 'address' | 'phone'>>): Promise<void> {
    await this.db.customer.update({ where: { id }, data });
  }

  updateCustomerPassword(id: number, password: string): Promise<void>
  updateCustomerPassword(email: string, password: string): Promise<void>
  async updateCustomerPassword(arg: number | string, password: string): Promise<void> {
    if(typeof arg === 'number') await this.db.customer.update({ where: { id: arg }, data: { password } });
    else if(typeof arg === 'string') await this.db.customer.update({ where: { email: arg }, data: { password } });
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    const customer = await this.db.customer.findFirst({ where: { id } });
    return customer;
  }

  async getCustomerByEmail(email: string): Promise<Pick<Customer, 'id' | 'email' | 'password' | 'emailVerified'> | null> {
    const customer = await this.db.customer.findFirst({ where: { email }, select: { id: true, email: true, password: true, emailVerified: true } });
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
          select: { price: true, itemNo: true, orderId: true, productId: true, product: { select: { name: true } } }
        }
      }
    });
    return orders;
  }

  getCustomersCount(id: number): Promise<number>;
  getCustomersCount(email: string): Promise<number>;
  async getCustomersCount(arg: number | string): Promise<number> {
    let count = 0;
    if (typeof arg === 'number') count = await this.db.customer.count({ where: { id: arg } });
    else if (typeof arg === 'string') count = await this.db.customer.count({ where: { email: arg } });

    return count;
  }

  async createProduct(data: Omit<Product, 'id' | 'isDeleted'>, images: Array<string> ): Promise<number> {
    const { name, category, manufacturer, model, desc, stock, year, specs, vendorId, warranty, price, isNew } = data
    const urls = images.map(img => ({ url: img }))
    const product = await this.db.product.create({ data: { name, category, manufacturer, model, desc, stock, year, specs, vendorId, warranty, price, isNew, images: { createMany: { data: urls } } }, select: { id: true } });
    return product.id;
  }

  async updateProduct(id: number, data: Partial<Omit<Product, 'id' | 'isDeleted' | 'isNew' | 'vendorId'>>, images?: Array<string>): Promise<void> {
    const operations: Array<any> = [this.db.product.update({ where: { id }, data })];
    if(images) operations.push(...[this.db.productImages.deleteMany({ where: { productId: 1 } }), this.db.productImages.createMany({ data: images?.map(img => ({ productId: id, url: img })) })]);
    await this.db.$transaction(operations, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.db.$transaction([this.db.product.update({ where: { id }, data: { isDeleted: true } })], { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async buyProducts(customerId: number, data: Array<Pick<Product, 'id' | 'stock'>>): Promise<void> {
    await this.db.$transaction(
      async t => {
        const products = new Map((await t.product.findMany({ where: { id: { in: data.map(d => d.id) }, isDeleted: false }, select: { id: true, stock: true, price: true } })).map(d => [d.id, { stock: d.stock, price: d.price }]));
        const updatePromises = [];
        for (let p of data) {
          if (!products.has(p.id)) throw new CustomError('invalid product id', StatusCodes.BAD_REQUEST);
          const currentStock = products.get(p.id)?.stock as number;
          if (p.stock > currentStock) throw new CustomError('insufficient stock', StatusCodes.BAD_REQUEST);
          updatePromises.push(t.product.update({ where: { id: p.id }, data: { stock: { decrement: p.stock } } }));
        }

        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('done');
          }, 2000);
        });

        await Promise.all(updatePromises);
        await t.order.create({ data: { customerId, products: { createMany: { data: data.map(d => ({ price: products.get(d.id)?.price as number, productId: d.id, itemNo: d.stock })) } } } });
        PaymentHandler.processPayment();
      },
      { maxWait: 60000, timeout: 120000, isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.db.product.findFirst({ where: { id } });
    return product;
  }

  async getVendorIdByProductId(productId: number): Promise<number | null> {
    const vendor = await this.db.vendor.findFirst({ where: { products: { some: { id: productId } } }, select: { id: true } });
    return vendor?.id || null;
  }

  async searchProducts(
    data: Partial<Pick<Product, 'vendorId' | 'isNew'>> &
      Pick<Product, 'category'> & {
        minPrice?: number;
        maxPrice?: number;
        specs?: Partial<cpuSpecs> | Partial<ramSpecs> | Partial<gpuSpecs> | Partial<motherBoardSpecs> | Partial<driveSpecs> | Partial<monitorSpecs> | Partial<mouseSpecs> | Partial<keyboardSpecs>;
      }
  ): Promise<Array<Pick<Product, 'id' | 'name' | 'desc' | 'model' | 'price' | 'stock' | 'isNew'>>> {
    const { category, vendorId, isNew, minPrice, maxPrice, specs } = data;
    const param = 'p';
    let counter = 5;
    let query = `
    SELECT [id], [name], [price], [stock], [isNew], [desc], [model]
    FROM Product
    WHERE 
        isDeleted = 0 AND
        category = @p1 AND
        (@p2 IS NULL OR price >= @p2) AND
        (@p3 IS NULL OR price <= @p3) AND
        (@p4 IS NULL OR vendorId = @p4) AND
        (@p5 IS NULL OR isNew = @p5)
  `;

    const params: Array<any> = [category, minPrice || null, maxPrice || null, vendorId || null, isNew || null];

    if (specs) {
      Object.entries(specs).forEach(([key, value]) => {
        let operator = ' = ';
        query += ` AND JSON_VALUE(specs, '$.' + @${param + ++counter})`;
        if (key === 'baseClock') operator = ' >= ';
        query += `${operator} @${param + ++counter}`;
        params.push(key);
        params.push(value);
      });
    }

    console.log(query);

    const products = (await this.db.$queryRawUnsafe(query, ...params)) as Array<Pick<Product, 'id' | 'name' | 'desc' | 'model' | 'price' | 'stock' | 'isNew'>>;
    return products;
  }

  generateSpecsQuery(
    specs: Partial<Pick<cpuSpecs, 'cores' | 'threads' | 'baseClock' | 'socket'>> &
      Partial<Pick<ramSpecs, 'size' | 'speed' | 'memoryType'>> &
      Partial<Pick<motherBoardSpecs, 'socket'>> &
      Partial<Pick<gpuSpecs, 'cores' | 'memoryType' | 'memorySize'>> &
      Partial<Pick<monitorSpecs, 'size' | 'panel' | 'refreshRate'>> &
      Partial<Pick<driveSpecs, 'size' | 'readSpeed' | 'writeSpeed'>>
  ): string {
    const keys: (keyof typeof specs)[] = ['cores', 'threads', 'baseClock', 'socket', 'size', 'speed', 'memorySize', 'socket', 'cores', 'memoryType', 'memorySize', 'size', 'panel', 'refreshRate', 'size', 'readSpeed', 'writeSpeed'];
    const query = keys
      .map(k => {
        if (specs[k] !== undefined) return `JSON_VALUE(specs, $.${k}) = ${specs[k]}`;
      })
      .join(' AND ');

    return query;
  }

  async getAllProducts(): Promise<Array<Product>> {
    const products = await this.db.product.findMany({ where: { isDeleted: false } });
    return products;
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
    const products = await this.db.product.findMany({ where: { vendorId } });
    return products;
  }

  async getProductsByName(name: string): Promise<Array<Pick<Product, 'id' | 'name' | 'price'>>> {
    const product = await this.db.product.findMany({ where: { name: { contains: name } }, select: { id: true, name: true, price: true } });
    return product;
  }

  async getAllProductsByVendorId(vendorId: number): Promise<Array<Product>> {
    const products = await this.db.product.findMany({ where: { vendorId } });
    return products;
  }

  async getAllOrdersByCustomerId(customerId: number): Promise<Array<Pick<Order, 'id'> & { products: Array<Pick<Product_Order, 'price' | 'itemNo'> & { product: Pick<Product, 'id' | 'name' | 'desc'>  }> }>> {
    const orders = await this.db.order.findMany({ where: { customerId }, select: { id: true, products: { select: { price: true, itemNo: true, product: { select: { id: true, name: true, desc: true } } } } } });
    return orders;
  }

  async getOrdersByVendorId(id: number): Promise<Array<Pick<Order, 'id'> & { customer: Pick<Customer, 'name' | 'email'> } & { products: Array<Pick<Product_Order, 'price' | 'itemNo'> & { product: Pick<Product, 'id' | 'name' | 'desc'>  }> }>> {
    const orders = await this.db.order.findMany({ where: { products: { some: { product: { vendorId: id } } } }, select: { id: true, customer: { select: { name: true, email: true } }, products: { select: { price: true, itemNo: true, product: { select: { id: true, name: true, desc: true } } } } } });
    return orders;
  }
}

export default SqlServerDataStore;
