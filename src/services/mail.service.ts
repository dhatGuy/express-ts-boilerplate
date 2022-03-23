/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from "@prisma/client";
import nodemailer from "nodemailer";
import HttpException from "../common/http-exception";
import logger from "../utils/logger";

const transporter = nodemailer.createTransport({
  port: Number(process.env.SMTP_PORT),
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
});

class MailService {
  url = "http://localhost:7000";

  verificationMail = async (email: string, token: string, user: User) => {
    const mailOptions = {
      from: process.env.SMTUse,
      to: email,
      subject: "Confirm your email",
      html: `
        <div>
          <h1>Welcome to our app</h1>
          <p>Hi ${user.name},</p>
          <p>Almost done! We just need to verify that odunsiolakunbi@gmail.com is yours, 
          so please verify your email and you'll be all set.</p>

          <button>
            <a href="${this.url}/auth/confirm-email?token=${token}&email=${email}">Verify your email</a>
          </button>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error(error);
      throw new HttpException(500, "Error sending email");
    }
  };

  signupMail = async (to: string, _name?: string) => {
    try {
      const message = {
        from: process.env.SMTP_USER,
        to,
        subject: "Welcome to Chai Bread",
        html: `<h1>Welcome to Chai Bread</h1>`,
      };

      await transporter.sendMail(message);
    } catch (error) {
      logger.error(error);
    }
  };

  forgotPasswordMail = async (token: string, email: string) => {
    try {
      const message = {
        to: email,
        subject: "Forgot Password",
        html: `<p>To reset your password, please click the link below.
      <a href="${this.url}/reset-password?token=${encodeURIComponent(
          token
        )}&email=${email}"><br/>
      Reset Password
      </a></p>
      <p><b>Note that this link will expire in the next one(1) hour.</b></p>`,
      };

      return await transporter.sendMail(message);
    } catch (error) {
      logger.error(error);
      throw new HttpException(500, "Error sending email");
    }
  };

  resetPasswordMail = async (email: string) => {
    try {
      const message = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Password Reset Successful",
        html: "<p>Your password has been changed successfully.</p>",
      };

      await transporter.sendMail(message);
    } catch (error) {
      logger.error(error);
      throw new HttpException(500, "Error sending email");
    }
  };
}

export default new MailService();
