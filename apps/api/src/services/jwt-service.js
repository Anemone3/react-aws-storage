import jwt from "jsonwebtoken";
import { ACCESS_JWT_KEY } from "../config/config.js";

export const generateToken = (payload, expiredTime) => {
    return new Promise((resolve,reject)=>{
        jwt.sign(payload, ACCESS_JWT_KEY, { expiresIn: expiredTime },(err, asyncToken)=>{
            if(err){
                resolve(null)
            }
            resolve(asyncToken)
        })

  });
};


// con key
export const verifyToken = (token, key) => {
    return new Promise((resolve,reject)=> {
        jwt.verify(token,key,(err,decodedToken)=> {
            if(err){
                resolve(null)
            }else{
                resolve(decodedToken)
            }
        });
    })

}


// sin key
export const decodeToken = (token)=>{
    const tokenDecoded = jwt.decode(token);

    if(!tokenDecoded) return null;

    return tokenDecoded;
}