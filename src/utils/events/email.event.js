import  jwt  from "jsonwebtoken";
import { EventEmitter } from "node:events";
import { confirmEmailTemplate } from "../email/template/confirmEmail.js";
import { sendEmail } from "../email/send.email.js";
import { generateToken } from "../security/token.js";

export const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email , userName } = {}) => {
  // const emailToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SIGNATURE);
  const emailToken = generateToken({payload : {email} , signature:process.env.EMAIL_TOKEN_SIGNATURE});
  const emailLink = `${process.env.FE_URL}/confirm-email/${emailToken}`;
  const html = confirmEmailTemplate({ link: emailLink, userName });
  await sendEmail({ to: email, subject: "confirmEmail", html });
});
