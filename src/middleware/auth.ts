import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(500).json({ message: "You Are Not Allow" });

      const authToken = token.split(' ')[1];
      if (!authToken) return res.status(500).json({ message: "You Are Not Allow" });

      const decoded = jwt.verify(authToken, config.jwtSecret!) as JwtPayload;
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role!)) {
        res.status(500).json({
          err: "UnAuthorized Access",
        });
      }
      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;