import path from "node:path"
import * as dotenv from 'dotenv';
dotenv.config({path:path.resolve("./src/config/.env.dev")})

import express from "express";
import bootstrap from "./src/app.controller.js";
import { sendEmail } from "./src/utils/email/send.email.js";
const app = express();
const port = process.env.PORT;

bootstrap(app, express);



app.listen(port, () => {
  console.log(`server is running or port ${port}`);
});
