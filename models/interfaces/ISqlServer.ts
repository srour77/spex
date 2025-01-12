import ICustomer from './customers';
import IProduct from './products';
import IVendor from './vendors';

interface ISqlServer extends IVendor, ICustomer, IProduct {}

export default ISqlServer;
