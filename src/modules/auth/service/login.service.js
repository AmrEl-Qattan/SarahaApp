import userModel from "../../../DB/model/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { compareHash } from "../../../utils/security/hash.js";
import { generateDecryption } from "../../../utils/security/encryption.js";
import { generateToken } from "../../../utils/security/token.js";
import { generateOTP } from "../../../utils/security/otp.js";
import { sendEmail } from "../../../utils/email/send.email.js";


export const login = asyncHandler(
  async(req , res, next)=>{
    
        const {email , password} = req.body;
        const user = await userModel.findOne({email })

        if (!user) {
            return res.status(404).json({message:"invalid email or password"})
        }
        
        if (!user.confirmEmail) {
            return res.status(404).json({message:"please confirm your email first"})
        }

        // const match = bcrypt.compareSync(password , user.password)
        const match = compareHash({plaintext: password , hashValue : user.password})

        if (!match) {
            return res.status(404).json({message:"invalid email or password"})
        }
        // decrypt phone 
        // user.phone = CryptoJS.AES.decrypt(user.phone , process.env.PHONE_ENC).toString(CryptoJS.enc.Utf8)
        user.phone = generateDecryption({cipherText : user.phone})
        
        // token
        // const token = jwt.sign({id: user._id , isLoggedIn:true},
        //     user.role == userRoles.admin ? process.env.TOKEN_SIGNATURE_ADMIN : process.env.TOKEN_SIGNATURE,
        //     {expiresIn: "1h"} )

        const token = generateToken({payload : {id: user._id , isLoggedIn:true},
        signature : user.role == userRoles.admin ? process.env.TOKEN_SIGNATURE_ADMIN : process.env.TOKEN_SIGNATURE,
        options : {expiresIn: "1d"} 
        })

        // if (user.isDeleted) {
        //     user.isDeleted = false;
        //     await user.save()
        // }


        // if (user.isDeleted) {
        // return res.status(403).json({ message: "This account is frozen. Contact support." });
        // }

        // check frozen
        if (user.isDeleted) {
            const otp = generateOTP();
            user.accountOTP = otp;
            user.accountOTPExpires = Date.now() + 10 * 60 * 1000; // 10 دقايق
            await user.save();

            await sendEmail({
                to : user.email,
                subject: "Reactivate your account",
                text: `Your OTP code is: ${otp}`,
            })

            return res.status(403).json({message: "Account frozen. OTP sent to your email to reactivate",})
        }

        

        // const refreshToken = generateToken({payload : {id: user._id , isLoggedIn:true},
        // signature : user.role == userRoles.admin ? process.env.TOKEN_REFRESH_ADMIN : process.env.TOKEN_REFRESH,
        // options : {expiresIn: "1d"} 
        // })
        // return res.status(200).json({message:"Done", token })
           return successResponse({res, message:"Done" , data: {token }}) 
}
)