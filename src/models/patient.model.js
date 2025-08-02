
import mongoose, { Schema, Types } from "mongoose";

const patientSchema = new Schema(
    {
        enrollmentId: {
            type: String,
            required: true
        },
        
        name: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true
        },
        
        gender:{
            type: String,
            enum: ["M","F","O"],
            required: true
        },

        adress:{
            type: String
        },

        contactNumber:{
            type: String,
            required: true
        },

        disease:{
            type: String,
            required: true
        },

        doctorAssigned:{
            type: Schema.Types.ObjectId,
            ref:"Doctor",
            required: true
        },

        admissionDate:{
            type: Date,
            default: Date.now()
        },

        disChargeDate:{
            type: Date
        },

        isAdmitted:{
            type: Boolean,
            default: true
        }

    },

    {
         timestamps: true 

    }
)


export const Patient = mongoose.model("Patient",patientSchema)