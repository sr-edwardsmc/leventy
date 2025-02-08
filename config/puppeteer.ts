// Singleton class for nodemailer instance
//
import Puppeteer from "puppeteer";

const puppeterSingleton = async () => {
  return await Puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-color",
    ],
  });
};

declare const globalThis: {
  puppeteerGlobal: ReturnType<typeof puppeterSingleton>;
} & typeof global;

const browser = globalThis.puppeteerGlobal ?? puppeterSingleton();

export default browser;

if (process.env.NODE_ENV !== "production") globalThis.puppeteerGlobal = browser;
