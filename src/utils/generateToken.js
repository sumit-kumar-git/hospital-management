import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const generateAccessAndRefreshToken = async (userId) =>{

    try {
        const user = await User.findById(userId)
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
    
        user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    
    } catch (err) { 
      
        throw new ApiError(409,err.message || "something went wrong while generating token")
    }
}

export {generateAccessAndRefreshToken}