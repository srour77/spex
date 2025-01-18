import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import VendorRouter from './routes/vendor';
import SqlServerDataStore from './models/sqlDataStore';
import ProductRouter from './routes/product';
import CustomerRouter from './routes/customer';
import errorMiddleware from './middlewares/error';
import NotFoundMiddleware from './middlewares/notFound';

const app = express();

app.use(express.json());

const db = new SqlServerDataStore();

app.use('/vendor', new VendorRouter(db).getRouter());
app.use('/product', new ProductRouter(db).getRouter());
app.use('/customer', new CustomerRouter(db).getRouter());

app.use(errorMiddleware);
app.use(NotFoundMiddleware);

app.listen(2000, () => {
  console.log('server is running');
});
