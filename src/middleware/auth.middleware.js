import jwt from "jsonwebtoken";
import userModel from "../DB/model/User.model.js";
import { asyncHandler } from "../utils/error/error.js";
import { verifyToken } from "../utils/security/token.js";

export const userRoles = {
  user: "User",
  admin: "Admin"
}

export const authentication = ()=>{
  return asyncHandler(
    async (req, res, next) => {
 
    const { authorization } = req.headers;

    const [bearer, token] = authorization?.split(" ") || [];
    if (!bearer || !token) {
      return res.status(400).json({ message: "invalid token " });
    }
    
    // console.log(bearer, token);

    let signature = undefined;

    switch (bearer) {
      case "Admin":
        signature = process.env.TOKEN_SIGNATURE_ADMIN;
        break;

      case "Bearer":
        signature = process.env.TOKEN_SIGNATURE;
        break;

      default:
        break;
    }

    // const decoded = jwt.verify(token, signature);
    const decoded = verifyToken({token , signature});
    // console.log(decoded);
    if (!decoded?.id) {
      return res.status(400).json({ message: "invalid token payload" });
    }

    const user = await userModel.findById(decoded.id);
    // console.log({user});
    if (!user) {
      return res.status(404).json({ message: "not user found" });
    }

   if (user.changePasswordTime?.getTime() >= decoded.iat * 1000) {
     return res.status(400).json({ message: "invalid credentials" });
   }

    req.user = user;
    return next();
  
}
  )
}

export const authorization = (accessRoles = [])=>{
  return asyncHandler(
    async (req, res, next) => {

    if (!accessRoles.includes(req.user.role)) {
      return res.status(403).json({message : "un authorized account "})
    }


    return next();
 
}
  )
}
