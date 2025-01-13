import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import ProductController from '../controllers/product';

class ProductRouter {
  private router: Router;
  private controller: ProductController;

  constructor(db: ISqlServer) {
    this.router = Router();
    this.controller = new ProductController(db);
    this.buildRoutes();
  }

  buildRoutes(): void {
    this.router.get('/get');
    this.router.post('/new', this.controller.create);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default ProductRouter;
