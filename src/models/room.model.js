import mongoose ,{Schema} from "mongoose";

const roomSchema = new Schema(
    {
        roomNumber:{
            type: String,
            required: true,           // room no: G-04
            unique: true
        },

        patient:{
            type: Schema.Types.ObjectId,
            ref: "Patient"
        },

        isOccupied:{
            type: Boolean,
            default:false
        },

        roomType:{
            type: String,
            enum: ["General","Private","Semi-Private","ICU"],
            required: true
        }
    },
    
    {timestamps:true})

    export const Room = mongoose.model("Room",roomSchema)