import { Router } from "express";
import * as registrationService from "./service/registration.service.js"
import { login } from "./service/login.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validator from './service/auth.validation.js'

const router = Router();

router.post("/signup" , validation(validator.signup), registrationService.signup)
router.post("/login" ,validation(validator.login), login)
router.patch("/confirm-email" , registrationService.confirmEmail)

export default router;