import jwt from "jsonwebtoken";
import { Response } from "express";



export const generateTokenAndSetCookie = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, "secret", {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    });

    return token;
  }