import connectDB from "./DB/connection.js";
import authController from "./modules/auth/auth.controller.js"
import userController from "./modules/user/user.controller.js"
import messageController from "./modules/message/message.controller.js"
import cors from 'cors'

app.use(cors())
const bootstrap = (app , express)=>{
    app.use(express.json());

    app.get("/", (req,res,next)=>{
        return res.status(200).json({message:"welcome"})
    })

    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/message", messageController)

    app.all("*" , (req, res, next)=>{
        return res.status(404).json({message:"invalid routing"})
    })

    // DB
    connectDB()
}


export default bootstrap;