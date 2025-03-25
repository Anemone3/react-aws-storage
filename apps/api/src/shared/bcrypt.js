import { compareSync, hashSync } from "bcryptjs";


export const hashPassword = (password)=>{
    return hashSync(password)
}

export const comparePassword = (password,hashedPassword) => {
    return compareSync(password,hashedPassword);
}