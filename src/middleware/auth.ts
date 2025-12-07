import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You have no access to this route",
        });
      }
      const splitToken = token.split(" ")[1];
      const verifiedToken = splitToken || token;

      const decoded = jwt.verify(verifiedToken, config.jwtSecret!) as JwtPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role!)) {
        return res.status(403).json({
          success: false,
          message: "You have no access to this route",
        });
      }
      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
