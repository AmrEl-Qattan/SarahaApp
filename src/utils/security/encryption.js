import CryptoJS from "crypto-js";

export const generateEncryption = ({plaintext = "" , signature = process.env.PHONE_ENC} = {})=>{
  const encryptPhone =  CryptoJS.AES.encrypt(plaintext , signature).toString()
  return encryptPhone
}

export const generateDecryption = ({cipherText = "" , signature = process.env.PHONE_ENC} = {})=>{
  const decrypt =  CryptoJS.AES.decrypt(cipherText , signature).toString(CryptoJS.enc.Utf8)
  return decrypt
}