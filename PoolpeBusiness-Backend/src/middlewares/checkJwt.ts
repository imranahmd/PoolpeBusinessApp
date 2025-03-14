import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../db/data-source"
import * as jwt from "jsonwebtoken";
import { Pin } from '../entity/Pin';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers["auth"];

  if (!token) {
    return res.status(401).json({
      error: 1,
      status: 401,
      message: "Token not provided.",
    });
  }

  let jwtPayload: any;

  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWTSECRET || "default_secret");
  } catch (error) {
    return res.status(401).json({
      error: 1,
      status: 401,
      message: "Invalid token.",
    });
  }

  const { mobileNumber } = jwtPayload;

  try {
    const pinRepository = AppDataSource.getRepository(Pin);

    // Find the user and verify the token and isLoggedIn status
    const userPin = await pinRepository.findOne({ where: { mobileNumber } });

    if (!userPin || userPin.token !== token) {
      return res.status(401).json({
        error: 1,
        status: 401,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    return res.status(500).json({
      error: 1,
      status: 500,
      message: "Error validating token.",
    });
  }
};


export const adminCheckJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWTSECRET);
    res.locals.jwtPayload = jwtPayload;
    // console.log(res.locals.jwtPayload)
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).json({error: 1, status: 401, message : "Error."});
  }
  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username, is_admin } = jwtPayload;
  if(is_admin==0)
  {
    console.log("Error.")
    return res.status(401).json({error: 1, status: 401, message : "Error."});
  }
  
  const newToken = jwt.sign({ userId, username }, process.env.JWTSECRET, {
    expiresIn: "720h"
  });
  res.setHeader("token", newToken);
  //Call the next middleware or controller
  next();
};