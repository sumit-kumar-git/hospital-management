import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
    {

        enrollmentId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },


        name: {
            type: String,
            required: true
        },

        specialization: {
            type: String,
            required: true
        },

        contactNumber: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        isActive:{
            type: Boolean,
            default: true
        }

    },

    {
        timestamps: true
    }
)

export const Doctor = mongoose.model("Doctor", doctorSchema)