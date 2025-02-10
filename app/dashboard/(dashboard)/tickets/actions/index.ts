"use server";
import { randomUUID } from "crypto";
import * as path from "path";
import * as fs from "fs";
import * as QRCode from "qrcode";

import { Role, TicketStatus } from "@prisma/client";

import db from "@/config/db";
import getTransporter from "@/config/nodemailer";
import browserPromise from "@/config/puppeteer";
import type { TTicket } from "@/types/events";
import { getISODateGMTminus5 } from "@/utils/funcs";

export const getEvents = async () => {
  return await db.event.findMany();
};

export const getCollectiveEvents = async (collectiveId: string) => {
  return await db.event.findMany({
    where: {
      collectiveId,
      date: {
        gte: new Date().toISOString(),
      },
    },
  });
};

export const changeTicketStatus = (
  ticketId: string,
  newStatus: TicketStatus
): Promise<TTicket> => {
  return db.ticket.update({
    where: {
      id: ticketId,
    },
    include: {
      raver: true,
      generatedBy: true,
      ticketing: true,
    },
    data: {
      status: newStatus,
    },
  }) as Promise<TTicket>;
};

export const getCollectiveUsers = async (collectiveId: string) => {
  return await db.user.findMany({
    where: {
      collectiveId,
    },
  });
};

export const getGeneratedTicketsByEventId = async (
  eventId: string,
  promoterId?: string
) => {
  return await db.ticket.findMany({
    where: {
      eventId,
      generatedById: promoterId,
    },
    include: {
      raver: true,
      generatedBy: true,
      ticketing: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTicketing = async (eventId: string) => {
  return await db.ticketing.findMany({
    where: {
      eventId,
      isAvailable: true,
    },
  });
};

export const generateTicket = async (data: {
  fullName: string;
  birthday?: string;
  idNumber: string;
  eventId: string;
  email: string;
  phone: string;
  gender?: string;
  city: string;
  generatedById: string;
  ticketingId: string;
}) => {
  const {
    fullName,
    birthday,
    idNumber,
    eventId,
    email,
    phone,
    gender,
    city,
    generatedById,
    ticketingId,
  } = data;

  try {
    // Generate QR code
    const randomId = randomUUID();
    const uniqueIdentifier = `${randomId}-${idNumber}-${eventId}`;

    // run two tasks in parallel
    const eventConfig = await db.eventConfig.findUnique({
      where: {
        eventId,
      },
    });

    const [qrCode, browser] = await Promise.all([
      QRCode.toDataURL(uniqueIdentifier),
      browserPromise,
    ]);

    const [page, logoImage] = await Promise.all([
      browser.newPage(),
      getImageBase64(eventConfig?.bgImageUrl!),
    ]);

    await page.emulateMediaType("screen");

    const htmlContent = eventConfig?.ticketHtml
      .replace("[logoImage]", logoImage)
      .replace("[qrCode]", qrCode)
      .replace("[fullName]", fullName)
      .replace("[idNumber]", idNumber);

    await page.setContent(htmlContent!);

    const pdfPath = `/tmp/ticket-${randomId}.pdf`;
    await page.pdf({ path: pdfPath, format: "A4" });

    page.close().then(() => {});

    const raverRecord = await db.raver.create({
      data: {
        email: email,
        fullName: `${fullName}`,
        city,
        phone,
        birthday,
        idNumber,
        createdAt: getISODateGMTminus5(new Date()),
        updatedAt: getISODateGMTminus5(new Date()),
      },
    });

    if (!raverRecord) {
      throw new Error("Error creating raver record");
    }

    const createdTicket = await db.ticket.create({
      data: {
        eventId,
        raverId: raverRecord.id,
        tickedId: uniqueIdentifier,
        ticketingId,
        status: TicketStatus.ACTIVE,
        generatedById: generatedById,
        createdAt: getISODateGMTminus5(new Date()),
      },
    });

    // Send the ticket to the user email via gmail

    const mailOptions = {
      from: `${eventConfig?.emailFrom} ${eventConfig?.ticketingEmailAddress}`,
      to: email,
      subject: eventConfig?.emailSubject,
      html: `${eventConfig?.emailBody.replace("[NAME]", `${fullName}!`)}`,
      attachments: [
        {
          filename: `ticket-${randomId}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    const eventTransporter = getTransporter(
      eventConfig?.ticketingEmailAddress!,
      eventConfig?.ticketingAppPassword!
    );

    eventTransporter.sendMail(mailOptions).then((info) => {
      console.log("Email sent: " + info.response);
    });

    return {
      status: "success",
      message: "Ticket generated",
      data: createdTicket,
    };
  } catch (e) {
    console.error(e);
  }
};

export const generateMassiveTickets = async (
  userId: string,
  eventId: string,
  data: string[][]
) => {
  const eventTicketing = await db.ticketing.findMany({ where: { eventId } });

  const dataWithTicketing = data.map((record) => {
    const ticketing = eventTicketing.find(
      (ticketing) => ticketing.name === record[6]
    );

    return {
      fullName: record[0],
      email: record[1],
      idNumber: String(record[2]),
      cellphone: record[3],
      gender: record[4],
      city: record[5],
      ticketingId: ticketing?.id,
    };
  });

  const tickets = await Promise.all(
    dataWithTicketing.map((record) => {
      generateTicket({
        fullName: record.fullName,
        birthday: "",
        idNumber: record.idNumber,
        eventId,
        email: record.email,
        phone: record.cellphone,
        city: record.city,
        generatedById: userId,
        ticketingId: record.ticketingId!,
        gender: record.gender,
      });
    })
  );

  return tickets;
};

export const validateTicket = async (
  ticketId: string
): Promise<{ status: string; message: string; ticket?: TTicket }> => {
  const ticket = await db.ticket.findFirst({
    where: {
      tickedId: ticketId,
    },
    include: {
      raver: true,
      generatedBy: true,
      ticketing: true,
    },
  });

  if (!ticket) {
    return {
      status: "invalid",
      message: "QR Inválido, Ticket no encontrado. Contacta al soporte.",
    };
  }

  if (ticket.status === "CHECKED") {
    return {
      status: "error",
      message: "El Ingreso ya fue usado.",
      ticket,
    };
  }
  // assign the exact time in utc -5 to the checked at

  await db.ticket.update({
    where: {
      id: ticket.id,
      tickedId: ticketId,
    },
    data: {
      checkedAt: getISODateGMTminus5(new Date()),
      status: "CHECKED",
    },
  });

  return {
    status: "success",
    message: "Ingreso aprobado.",
    ticket,
  };
};

export async function getImageBase64(imageName: string) {
  try {
    // Construct the path to the image file
    const imagePath = path.join(process.cwd(), "public", imageName);

    // Read the image file as a buffer
    const imageBuffer = await fs.promises.readFile(imagePath);

    // Convert the buffer to a Base64 string
    const base64Image = imageBuffer.toString("base64");

    return base64Image;
  } catch (error) {
    console.error("Error reading the image file:", error);
    throw error;
  }
}
