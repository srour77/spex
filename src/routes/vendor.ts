import { Router } from 'express';
import ISqlServer from '../models/interfaces/ISqlServer';
import VendorController from '../controllers/vendor';
import { validateReqBody } from '../middlewares/validations';
import { createVendorSchema, loginVendorSchema } from '../requestsSchemas/vendor';
import AuthenticationMiddleware from '../middlewares/authentication';
import { Roles } from '../globals/enums';
import { requestPasswordResetSchema, resetPasswordSchema } from '../requestsSchemas/customer';
const authenticate = AuthenticationMiddleware.authenticateUser;
const authorize = AuthenticationMiddleware.authorizeUser;

class VendorRouter {
  private router: Router;
  private controller: VendorController;

  constructor(db: ISqlServer) {
    this.router = Router();
    this.controller = new VendorController(db);
    this.buildRoutes();
  }

  buildRoutes(): void {
    this.router.post('/new', validateReqBody(createVendorSchema), this.controller.create);
    this.router.post('/login', validateReqBody(loginVendorSchema), this.controller.login);
    this.router.get('/get/profile', authenticate, authorize([Roles.vendor]), this.controller.getProfile);
    this.router.post('/password/requestreset', validateReqBody(requestPasswordResetSchema), this.controller.requestPasswordReset);
    this.router.post('/password/reset', validateReqBody(resetPasswordSchema), this.controller.resetPassword);
    this.router.get('/orders', authenticate, authorize([Roles.vendor]), this.controller.getOders);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default VendorRouter;
