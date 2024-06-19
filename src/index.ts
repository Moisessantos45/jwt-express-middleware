import { Response, Request, NextFunction } from "express";
import { verify, sign, Algorithm, SignOptions } from "jsonwebtoken";

/**
 * @interface Message
 * @property {string} successMessage - Message to be sent when token is valid
 * @property {string} errorMessage - Message to be sent when token is invalid
 */
interface Message {
  successMessage?: string;
  errorMessage?: string;
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

/**
 * @function jwtMiddleware
 * @param {string} secretKey - Secret key to be used for the token
 * @param {JwtMiddlewareOptions} options - Options to be used for the token
 * @returns {Function} - Middleware function
 */

const defaultOptions: JwtMiddlewareOptions = {
  message: {
    successMessage: "Token is valid",
    errorMessage: "Invalid token",
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
  options: JwtMiddlewareOptions = defaultOptions
) => {
  const { message, algorithms } = {
    ...defaultOptions,
    ...options,
    message: {
      ...defaultOptions.message,
      ...options.message,
    },
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({ message: message!.errorMessage });
      return;
    }

    verify(token, secretKey, { algorithms }, (err, _decoded) => {
      if (err) {
        res.status(401).send({ message: message!.errorMessage });
        return;
      }
      next();
    });
  };
};

/**
 * @function extractToken
 * @param {Request} req - Request object
 * @returns {string} - Token
 */

const extractToken = (req: Request): string => {
  const token = req.headers["authorization"]?.split(" ")[1] || "";
  return token;
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
  options: JwtMiddlewareOptions = defaultOptions
): string => {
  const { expiresIn, algorithms } = {
    ...defaultOptions,
    ...options,
  };
  const signOptions: SignOptions = {
    expiresIn,
    algorithm: algorithms![0],
  };

  return sign(payload, secretKey, signOptions);
};

export { jwtMiddleware, extractToken, generateToken };
