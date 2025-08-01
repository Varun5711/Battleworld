'use server';

import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_SENDER = process.env.SITE_MAIL_SENDER || SMTP_SERVER_USERNAME;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false, // use TLS
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

/**
 * Sends an email to the candidate about their application.
 */
export async function sendEmailToCandidate({
  to,
  subject,
  body,
  interviewId,
}: {
  to: string;
  subject: string;
  body: string;
  interviewId?: string;
}) {
  try {
    await transporter.verify();

    const mailOptions = {
      from: SITE_MAIL_SENDER,
      to,
      subject,
      text: interviewId
        ? `${body}\n\nInterview ID: ${interviewId}`
        : body,
    };

    const info = await transporter.sendMail(mailOptions);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}