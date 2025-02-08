// Singleton class for nodemailer instance
//
import nodemailer from "nodemailer";

const nodemailerSingleton = (user: string, pass: string) => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
};

declare const globalThis: {
  [key: `nodemailerGlobal-${string}`]: ReturnType<typeof nodemailerSingleton>;
} & typeof global;

const getTransporter = (user: string, pass: string) => {
  const transporter =
    globalThis[`nodemailerGlobal-${user}`] ?? nodemailerSingleton(user, pass);
  return transporter;
};

export default getTransporter;
