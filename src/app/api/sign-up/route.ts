import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/user.models";
import bcrypt from "bcrypt";

import { sendVerificationEmail } from "@/helpers/sendEmail";
import { STATUS_CODES } from "http";
import { use } from "react";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existedVerifiedUsername = await UserModel.findOne(
            {
                username,
                isVerified: true
            })

        if (existedVerifiedUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        const existedUserByEmail = await UserModel.findOne({ email })
        const generatedOTP = (Math.floor(100000 + Math.random() * 900000)).toString()
        if (existedUserByEmail) {
            if (existedUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existedUserByEmail.password = hashedPassword
                existedUserByEmail.verifyCode = generatedOTP
                existedUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existedUserByEmail.save();

            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                isVerified: false,
                verifyCode: generatedOTP,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save();


        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            generatedOTP
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            },
                {
                    status: 500

                }
            )
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email",
        }, {
            status: 201
        })
    } catch (error) {
        console.error("Error while registering user", error)
        return Response.json({
            success: false,
            message: "Error while registering user",
        }, {
            status: 500
        }
        )
    }
}