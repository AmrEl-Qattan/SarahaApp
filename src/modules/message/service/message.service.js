import { asyncHandler } from "../../../utils/error/error.js";
import userModel from "../../../DB/model/User.model.js"
import messageModel from "../../../DB/model/message.model.js";
import { successResponse } from "../../../utils/response/success.response.js";
export const sendMessage = asyncHandler(async(req , res , next)=>{

    const {message , recipientId} = req.body;
    if (!await userModel.findOne({ _id: recipientId , isDeleted: false})) {
        return res.status(404).json({message: "invalid Account"})
    }
    const newMessage = await messageModel.create({message , recipientId})
    return successResponse({res , message: "done" , status: 201 , data: {message: newMessage}})
})