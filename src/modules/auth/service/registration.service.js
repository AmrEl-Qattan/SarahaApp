import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import {  generateHash } from "../../../utils/security/hash.js";
import {  generateEncryption } from "../../../utils/security/encryption.js";
import {  verifyToken } from "../../../utils/security/token.js";


export const signup = asyncHandler(
  async (req, res ,next)=>{
      const {userName , email , password , confirmationPassword , phone } = req.body;
      // console.log({userName , email , password , confirmationPassword });

 
    
    // if (password !== confirmationPassword) {
    //     return res.status(400).json({message:"password miss match confirmation password"})
    // }

    const checkUser = await userModel.findOne({email})
    if (checkUser) {
        return res.status(409).json({message:"Email already exist"})
    }
    
    // hash Password
    // const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT))
    const hashPassword = generateHash({plaintext : password })

    // hash phone 
    // const encryptPhone = CryptoJS.AES.encrypt(phone , process.env.PHONE_ENC).toString()
    const encryptPhone = generateEncryption({plaintext : phone})
    
    // store user in DB
    const user = await userModel.create({userName , email , password:hashPassword , phone:encryptPhone})

    // send confirmation Email
     emailEvent.emit("sendConfirmEmail" , {email , userName})

    return res.status(201).json({message:"done",user })
  
}
)

export const confirmEmail = asyncHandler(
  async (req, res ,next)=>{
  
    const {authorization} = req.headers;
    
    // const decoded = jwt.verify(authorization, process.env.EMAIL_TOKEN_SIGNATURE);
    const decoded = verifyToken({token : authorization , signature : process.env.EMAIL_TOKEN_SIGNATURE});
    const user = await userModel.findOneAndUpdate({email: decoded.email} , {confirmEmail:true} , {new: true})
    
    // return res.status(201).json({message:"done",user })
    return successResponse({res, message:"Done" , data: {user} , status:201}) 


}
)

