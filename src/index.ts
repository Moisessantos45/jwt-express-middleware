import { Response, Request as ExpressRequest, NextFunction } from "express";
import { verify, sign, Algorithm, SignOptions } from "jsonwebtoken";

/**
 * @interface Message
 * @property {string} successMessage - Message to be sent when token is valid
 * @property {string} errorMessage - Message to be sent when token is invalid
 */
interface Message {
  success?: string;
  error?: string;
}

/**
 * @interface JwtMiddlewareOptions
 * @property {Message} message - Message to be sent when token is valid or invalid
 * @property {string} expiresIn - Expiry time for the token
 * @property {Algorithm[]} algorithms - Algorithms to be used for the token
 */

interface JwtMiddlewareOptions {
  message?: Message;
  expiresIn?: string;
  algorithms?: Algorithm[];
}

/**
 * @interface JwtPayload
 * @property {string} key - Value of the key
 */

interface JwtPayload {
  [key: string]: string;
}

interface Request extends ExpressRequest {
  user?: JwtPayload;
}

/**
 * @function jwtMiddleware
 * @param {string} secretKey - Secret key to be used for the token
 * @param {JwtMiddlewareOptions} options - Options to be used for the token
 * @returns {Function} - Middleware function
 */

const DEFAULT_OPTIONS: Required<JwtMiddlewareOptions> = {
  message: {
    success: "Token is valid",
    error: "Invalid token",
  },
  expiresIn: "1h",
  algorithms: ["HS256"],
};

/**
 * @function jwtMiddleware
 * @param {string} secretKey - Secret key to be used for the token
 * @param {JwtMiddlewareOptions} options - Options to be used for the token
 * @returns {Function} - Middleware function
 * @description - Middleware function to verify the token
 * @example jwtMiddleware (secretKey, options) => (req, res, next) => {}
 * @example jwt = jwtMiddleware (secretKey, options) => jwt (req, res, next) => {}
 * @example jwt (req, res, next) => {}
 * @example jwt = jwtMiddleware (secretKey) => jwt (req, res, next) => {}
 */

const jwtMiddleware = (
  secretKey: string,
  options: JwtMiddlewareOptions = {}
) => {
  const { message, algorithms } = {
    ...DEFAULT_OPTIONS,
    ...options,
    message: { ...DEFAULT_OPTIONS.message, ...options.message },
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    verify(token, secretKey, { algorithms }, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: message.error });
        return;
      }
      req.user = decoded as JwtPayload;
      next();
    });
  };
};

/**
 * @function extractToken
 * @param {Request} req - Request object
 * @returns {string} - Token
 */

const extractToken = (req: Request): string | undefined => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;
};

/**
 * @function generateToken
 * @param {JwtPayload} payload - Payload to be used for the token
 * @param {string} secretKey - Secret key to be used for the token
 * @param {JwtMiddlewareOptions} options - Options to be used for the token
 * @returns {string} - Token
 */

const generateToken = (
  payload: JwtPayload,
  secretKey: string,
  options: JwtMiddlewareOptions = {}
): string => {
  const { expiresIn, algorithms } = { ...DEFAULT_OPTIONS, ...options };
  const signOptions: SignOptions = { expiresIn, algorithm: algorithms[0] };
  return sign(payload, secretKey, signOptions);
};

export { jwtMiddleware, extractToken, generateToken };
