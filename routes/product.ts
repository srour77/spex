import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import ProductController from '../controllers/product';
import AuthenticationMiddleware from '../middlewares/authentication';
import { Roles } from '../globals/enums';
import validateSchema from '../middlewares/validations';
import { updateProductSchema } from '../requestsSchemas/product';
const authenticate = AuthenticationMiddleware.authenticateUser;
const authorize = AuthenticationMiddleware.authorizeUser;

class ProductRouter {
  private router: Router;
  private controller: ProductController;

  constructor(db: ISqlServer) {
    this.router = Router();
    this.controller = new ProductController(db);
    this.buildRoutes();
  }

  buildRoutes(): void {
    this.router.get('/get/all', this.controller.getAllProducts);
    this.router.get('/get/:id', this.controller.getById);
    this.router.put('/update/:id', authenticate, authorize([Roles.vendor]),validateSchema(updateProductSchema), this.controller.update);
    this.router.post('/new', authenticate, authorize([Roles.vendor]), this.controller.create);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default ProductRouter;
