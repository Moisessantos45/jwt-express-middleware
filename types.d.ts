import { Request, Response, NextFunction } from "express";
import { Algorithm } from "jsonwebtoken";

export interface Message {
  successMessage?: string;
  errorMessage?: string;
}

export interface JwtMiddlewareOptions {
  message?: Message;
  expiresIn?: string;
  algorithms?: Algorithm[];
}

export interface JwtPayload {
  [key: string]: string;
}

export function jwtMiddleware(
  secretKey: string,
  options?: JwtMiddlewareOptions
): (req: Request, res: Response, next: NextFunction) => void;

export function extractToken(req: Request): string;

export function generateToken(
  payload: JwtPayload,
  secretKey: string,
  options?: JwtMiddlewareOptions
): string;
