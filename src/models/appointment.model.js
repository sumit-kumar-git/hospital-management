import mongoose ,{Schema} from "mongoose";


const appointmentSchema = new Schema(
    {
        patient:{
            type: Schema.Types.ObjectId,
            ref:"Patient",
            required:true
        },

        doctor:{
            type: Schema.Types.ObjectId,
            ref:"Doctor",
            required: true
        },

        appointmentDate:{
            type: Date,
            required: true
        },

        reason:{
            type: String,
            required: true       
        },

        appointmentStatus:{
            type: String,
            enum:["Scheduled","Completed","Cancelled"],
            default:"Scheduled"
        }
    },
    
    {timestamps:true})

    export const Appointment = mongoose.model("Appointment",appointmentSchema)