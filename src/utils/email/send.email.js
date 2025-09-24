import nodemailer from "nodemailer";

export const sendEmail = async ({to = "" , cc = "", bcc = "" , subject = "sarahahApp" , text = "" , html = "" , attachments = []} = {}) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Wrap in an async IIFE so we can use await.

  const info = await transporter.sendMail({
    from: `"sarahahaApp" <${process.env.EMAIL}>`,
   to,
   cc,
   bcc,
   text,
   html, subject, attachments
  });

  return info
};
