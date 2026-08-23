import nodemailer from "nodemailer";

const getTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || "noreply@smartdocs.local";
  const transport = getTransport();

  if (!transport) {
    console.log("SMTP not configured. Email payload below:");
    console.log({ to, from, subject, text, html });
    return;
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
