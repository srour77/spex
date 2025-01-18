import ICustomer from './customer';
import IProduct from './product';
import IVendor from './vendor';

interface ISqlServer extends IVendor, ICustomer, IProduct {}

export default ISqlServer;
