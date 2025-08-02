import dotenv from "dotenv"
import { connectdb } from "./db/connectDb.js";
import { app } from "./app.js";

dotenv.config({
  path:"./.env"
})



connectdb()
.then(() => {
  app.on("error",(err) => {
    console.log("connection error",err)
  })

  app.listen(process.env.PORT || 4000,() =>{
    console.log(`server is listening on port ${process.env.PORT}`);
    
  })
})
.catch((err) =>{
   console.log(`connection ERROR !!! ${err}`)
})