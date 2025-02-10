import { getImageBase64 } from "@/app/dashboard/(dashboard)/tickets/actions";
import PuppeteerConfig from "@/config/puppeteer";
import { getPDFHtmlContent } from "@/utils/tickets";
import { NextRequest, NextResponse } from "next/server";
import * as Puppeteer from "puppeteer";

import * as QRCode from "qrcode";
import db from "@/config/db";

export async function POST(req: NextRequest) {
  // Get parameters from body
  const { fullName, idNumber, ticketId, eventId } = await req.json();
  const browser = await Puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-color",
    ],
  });

  const eventConfig = await db.eventConfig.findFirst({
    where: {
      eventId,
    },
  });

  const page = await browser.newPage();

  const logoImage = await getImageBase64(eventConfig?.bgImageUrl!),
    qrCode = await QRCode.toDataURL(ticketId);

  const htmlContent = eventConfig?.ticketHtml
    .replace("[logoImage]", logoImage)
    .replace("[qrCode]", qrCode)
    .replace("[fullName]", fullName)
    .replace("[idNumber]", idNumber);

  await page.setContent(htmlContent!);

  const fileBuffer = await page.pdf({ format: "A4" });
  await page.close();

  browser.close().then(() => {});

  const response = new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ticket-${ticketId}.pdf`,
    },
  });

  return response;
}
