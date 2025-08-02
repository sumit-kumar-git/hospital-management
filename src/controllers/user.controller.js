import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"
import { generateAccessAndRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken"






//🎯registerUser

const registerUser = asyncHandler(async (req, res) => {

    //  return res.status(200).json({
    //     statusCode:200,
    //     message:"ok"
    //  })

    // get data from user-req.body
    // validate for empty
    // check for existing user
    // create user by .create method
    // remove password and refreshToken from res data


    const { name, email, username, password, role } = req.body

    if (
        [name, email, username, password, role].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(404, "All fields are required")
    }

    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (existedUser) {
        throw new ApiError(400, "user with this email or username is exist")
    }

    const user = await User.create({
        name,
        email,
        username,
        password,
        role
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")


    if (!createdUser) {
        throw new ApiError(401, "user not created")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "user registerd successfully"
            )
        )


})

//🎯login user

const loginUser = asyncHandler(async (req, res) => {

    // get user details  - email,username,password by req.body
    // validte - empty
    // check - user exist
    // generate accessToken and refreshToken
    // remove refreshToken from reponse user details


    const { username, email, password, role } = req.body

    if (!role) {
        throw new ApiError(400, "role is missing");

    }

    if (!username && !email) {
        throw new ApiError(409, "username or email is required")
    }

    if (!password) {
        throw new ApiError(401, "password is required")
    }


    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!existedUser) {
        throw new ApiError(403, "user with this email or username does not exist ")
    }

    const isPasswordValid = await existedUser.isPasswordCorrect(password)

    if (!password) {
        throw new ApiError(403, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser?._id)

    const loggedinUser = await User.findById(existedUser?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser, accessToken, refreshToken
                },
                "user logged successfully"
            )
        )



})

//🎯logout user

const logoutUser = asyncHandler(async (req, res) => {

    // 🎯refresh token ko db and cookie se htana

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "user logout successfully"
            )
        )


})

//🎯refreshAccessToken

const refreshAccessToken = asyncHandler(async (req, res) => {

    // if access token is expired 
    // then we have to send refreshToken for refreshAccessToken

    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingToken) {
        throw new ApiError(404, "Invalid refresh token")
    }

    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

    if (!decodedToken) {
        throw new ApiError(402, "refresh token is expired")
    }

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new ApiError(403, "refresh token is expired")
    }

    if (user?.refreshToken?.toString() !== incomingToken.toString()) {
        throw new ApiError(403, "Invalid or expired token")
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "access token refreshed"
            )
        )
})

//🎯change password

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        throw new ApiError(400, "all fields are reqired");

    }
    if (newPassword.trim().toString() !== confirmNewPassword.trim().toString()) {
        throw new ApiError(400, "newPassword and confirmNewPassword are different")
    }

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(401, "unauthorized request")
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    user.password = newPassword

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "password changed successfully"
            )
        )
})


//🎯update user details

const updateUserDetails = asyncHandler(async (req, res) => {

    //🎯upadte name and email

    const { name, email } = req.body

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "unauthorized request")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name || user.name,
                email: email || user.email
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(400, "something went wrong while updating user")
    }

    // user.name = name || user.name
    // user.email = email || user.email

    // await user.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "user updated successfully"
            )
        )

})


//🎯get user(staff) profile by Id- admin can see

const getUserById = asyncHandler(async (req, res) => {

    const { userId } = req.params

    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "user fetched successfully"
            )
        )

})

//🎯delete a specific user 

const deleteAUser = asyncHandler(async (req, res) => {

    const { userId } = req.params

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    //🔊 only admin can delete 

    await user.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "user deleted successfully"
            )
        )

})







export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateUserDetails,
    getUserById,
    deleteAUser
}