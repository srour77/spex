import ICustomer from './customer';
import IOrder from './order';
import IProduct from './product';
import IVendor from './vendor';

interface ISqlServer extends IVendor, ICustomer, IProduct, IOrder {}

export default ISqlServer;
