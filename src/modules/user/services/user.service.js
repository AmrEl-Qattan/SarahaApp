import userModel from "../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/error/error.js";
import { generateDecryption } from "../../../utils/security/encryption.js";
import {compareHash, generateHash} from '../../../utils/security/hash.js';
import { successResponse } from "../../../utils/response/success.response.js";
import messageModel from "../../../DB/model/message.model.js";

export const profile = asyncHandler(async (req, res, next) => {
  req.user.phone = generateDecryption({cipherText : req.user.phone})
  const messages = await messageModel.find({recipientId: req.user._id}).populate({
    path: "recipientId",
    select: " -password "
  })
  return res.status(200).json({ message: "User Profile", user: req.user,messages });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({_id: req.params.userId , isDeleted:false}).select("userName email image gender")
  return user? res.status(200).json({ message: "User Profile", user }): res.status(404).json({ message: "invalid account id" })
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id , req.body , {new:true , runValidators:true})
  return res.status(200).json({ message: "Profile Updated", user});
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const {password , oldPassword} = req.body;
  if (!compareHash({plaintext: oldPassword , hashValue: req.user.password})) {
    // return next(new Error("invalid old password" , {cause: 409}))
    return res.status(409).json({ message: "invalid old password"}); 
  }
  
  const hashPassword = generateHash({plaintext: password})
  const user = await userModel.findByIdAndUpdate(req.user._id , {password: hashPassword , changePasswordTime: Date.now()} , {new:true , runValidators:true})
  return res.status(200).json({ message: "Password Updated", user});
});


export const freezeProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id , {isDeleted:true , changePasswordTime: Date.now()} , {new:true , runValidators:true})
  return res.status(200).json({ message: "Account Deleted", user});
});


export const activateAccount = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    user.accountOTP !== otp ||
    !user.accountOTPExpires ||
    user.accountOTPExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isDeleted = false;
  user.accountOTP = undefined;
  user.accountOTPExpires = undefined;
  await user.save();

  return successResponse({ res, message: "Account activated successfully" });
});
