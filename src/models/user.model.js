import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "password is required"]
        },

        name: {
            type: String,
            required: true
        },

        refreshToken: {
            type: String
        },

        role: {
            type: String,
            enum: ["admin", "staff"],
            default: "staff"
        }
    },

    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)