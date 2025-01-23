import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import CustomerController from '../controllers/customer';
import AuthenticationMiddleware from '../middlewares/authentication';
import { Roles } from '../globals/enums';
import { validateReqBody } from '../middlewares/validations';
import { createCustomerSchema, loginCustomerSchema, requestPasswordResetSchema, resetPasswordSchema } from '../requestsSchemas/customer';
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
    this.router.get('/get/profile', authenticate, authorize([Roles.customer]), this.controller.getProfile);
    this.router.post('/new', validateReqBody(createCustomerSchema), this.controller.create);
    this.router.post('/login', validateReqBody(loginCustomerSchema), this.controller.login);
    this.router.get('/orders', authenticate, authorize([Roles.customer]), this.controller.getAllOrders);
    this.router.post('/password/requestreset', validateReqBody(requestPasswordResetSchema), this.controller.requestPasswordReset);
    this.router.post('/password/reset', validateReqBody(resetPasswordSchema), this.controller.resetPassword);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default CustomerRouter;
