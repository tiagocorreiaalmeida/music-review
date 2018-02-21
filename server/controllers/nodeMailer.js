import nodemailer from "nodemailer";
import template from "../utils/template";

export const smtpTransport = nodemailer.createTransport({
    pool: true,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
    }
});

export const mailOptions = (to, subject, link) => ({
    to,
    subject,
    html: template(link)
});
