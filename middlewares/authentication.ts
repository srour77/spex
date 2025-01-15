import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { Roles } from '../globals/enums';
import { StatusCodes } from 'http-status-codes';
import { APIResponse, Token } from '../globals/types';

class AuthenticationMiddleware {
  static authenticateUser: RequestHandler<any, APIResponse> = async (req, res, next) => {
    const {
      headers: { authorization },
    } = req;
    const decoded = this.getTokenPayload(String(authorization));

    if (!decoded) res.status(StatusCodes.UNAUTHORIZED).json({ message: 'invalid token', success: false });

    if (decoded?.role === Roles.customer) Object.defineProperty(res.locals, Roles.customer, { value: decoded, enumerable: true });
    else Object.defineProperty(res.locals, Roles.vendor, { value: decoded, enumerable: true });
    next();
  };

  private static getTokenPayload(authorizationHeader: string): Token | null {
    const token = authorizationHeader.split(' ')[1];

    let decoded: Token | null;
    try {
      decoded = jwt.verify(token, String(process.env.JWT_SECRET)) as Token;
      if (decoded.id === undefined || decoded.email === undefined || decoded.role === undefined) decoded = null;
    } catch (err) {
      decoded = null;
    }

    return decoded;
  }

  static authorizeUser(roles: Array<Roles>) {
    const f: RequestHandler<any, APIResponse> = async(req, res, next) => {
        const role = res.locals[Roles.customer].role || res.locals[Roles.vendor].role || null
        if(!role || !roles.includes(role)) res.status(StatusCodes.UNAUTHORIZED).json({ message: 'unauthorized', success: false })
    }

    return f
  }
}

export default AuthenticationMiddleware;
