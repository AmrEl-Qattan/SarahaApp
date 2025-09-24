import mongoose, { model, Schema } from "mongoose";
import { userRoles } from "../../middleware/auth.middleware.js";

const userSchema = new Schema({
    userName:{
        type:String,
        minlength:2,
        maxLength:25,
        trim:true,
        required:[true , "UserName Is required"]
    },
    email:{
        type : String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:["male" , "female"],
        default:"male"
    },
    DOB:Date,
    address:String,
    phone:String,
    image:String,
    confirmEmail:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(userRoles),
        default:userRoles.user,
    },
    changePasswordTime:Date,
    isDeleted: {type: Boolean , default: false},
    accountOTP: { type: String },
    accountOTPExpires: { type: Date },

}, { timestamps: true });

const userModel = mongoose.models.User || model("User" , userSchema);

export default userModel;