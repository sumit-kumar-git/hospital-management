import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin:process.env.MONGODB_ORIGIN,
    credentials:true
}))



app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())



// route import 

import userRouter from "./routes/user.route.js"
import doctorRouter from "./routes/doctor.route.js"
import patientRouter from "./routes/patient.route.js"
import appointmentRouter from "./routes/appointment.route.js"
import roomRouter from "./routes/room.route.js"



// route declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/doctors",doctorRouter)
app.use("/api/v1/patients",patientRouter)
app.use("/api/v1/appointments",appointmentRouter)
app.use("/api/v1/rooms",roomRouter)





export {app}