import { Order, Product, Product_Order } from "@prisma/client";

interface IOrder {
    getAllOrdersByCustomerId(customerId: number): Promise<Array<Pick<Order, 'id'> & { products: Array<Pick<Product_Order, 'productId' | 'price' | 'itemNo'> & { product: Pick<Product, 'name' | 'desc'>  }> }>>;
}

export default IOrder