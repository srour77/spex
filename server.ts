import express from 'express';
import VendorRouter from './routes/vendor';
import SqlServerDataStore from './models/sqlDataStore';
import ProductRouter from './routes/product';

const app = express();

app.use(express.json());

const db = new SqlServerDataStore();

app.use('/vendor', new VendorRouter(db).getRouter());
app.use('/product', new ProductRouter(db).getRouter());

app.listen(2000, () => {
  console.log('server is running');
});
