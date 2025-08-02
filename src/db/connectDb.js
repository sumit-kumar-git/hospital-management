import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export const connectdb = async() => {
    try {
       const connectinInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`mongoDB connection host!!!${connectinInstance.connection.host}`)
    } catch (error) {
        console.log("mongoDB connection ERROR!!!",error);
        process.exit(1)
        
    }
}