import joi from "joi"
import { Types } from "mongoose";

export const validateObjectId = (value , helper)=>{
  return Types.ObjectId.isValid(value)
  ? true : helper.message("invalid objectId")
}

export const generalFields = {

  userName: joi.string().min(2).max(20).messages({
      "string.empty":"userName cannot be empty"
    }),
    email: joi.string().email({ tlds: { allow: ['com' , 'net' , 'org' , 'edu' , 'eg'] } }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmationPassword: joi.string(),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    id:joi.string().custom(validateObjectId),
    'accept-language': joi.string().valid("en" , "ar")
}

export const validation = (schema)=>{
  
    return (req, res, next)=>{

      const inputData = {...req.body , ...req.query , ...req.params}
      // console.log({inputData});
      if (req.headers['accept-language']) {
        inputData['accept-language'] = req.headers['accept-language']
      }
      // console.log({inputData});

      const validationResult = schema.validate(inputData, {abortEarly:false})
      if (validationResult.error) {
        return res.status(400).json({message: "validation Error" , validationResult:validationResult.error.details})

      }
      return next()
    }
}

// export const validation_custom = (schema)=>{

//     return (req, res, next)=>{
//       const validationErrors=[]
//       for (const key of Object.keys(schema)) {
//          const validationResult = schema[key].validate(req[key] , {abortEarly:false})
//       if (validationResult.error) {
//         validationErrors.push({key , err:validationResult.error.details})
//       }

//     }

//       if (validationErrors.length > 0) {
//         return res.status(400).json({message: "validation error" , validationResult:validationErrors})

//       }
//       return next()

//     }
// }