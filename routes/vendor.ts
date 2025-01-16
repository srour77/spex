import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import ProductController from '../controllers/product';
import VendorController from '../controllers/vendor';

class VendorRouter {
  private router: Router;
  private controller: VendorController;

  constructor(db: ISqlServer) {
    this.router = Router();
    this.controller = new VendorController(db);
    this.buildRoutes();
  }

  buildRoutes(): void {
    this.router.get('/get');
    this.router.post('/new', this.controller.create);
    this.router.post('/login', this.controller.login)
  }

  getRouter(): Router {
    return this.router;
  }
}

export default VendorRouter;
