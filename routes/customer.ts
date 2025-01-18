import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import CustomerController from '../controllers/customer';
import AuthenticationMiddleware from '../middlewares/authentication';
import { Roles } from '../globals/enums';
const authenticate = AuthenticationMiddleware.authenticateUser;
const authorize = AuthenticationMiddleware.authorizeUser;

class CustomerRouter {
  private router: Router;
  private controller: CustomerController;

  constructor(db: ISqlServer) {
    this.router = Router();
    this.controller = new CustomerController(db);
    this.buildRoutes();
  }

  buildRoutes(): void {
    this.router.get('/get/:id', authenticate, authorize([Roles.customer]), this.controller.getById);
    this.router.post('/new', this.controller.create);
    this.router.post('/login', this.controller.login);
    this.router.post('/buy', authenticate, authorize([Roles.customer]), this.controller.buy);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default CustomerRouter;
