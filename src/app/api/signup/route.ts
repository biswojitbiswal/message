import UserModel from "@/model/user.model";
import dbConnection from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import crypto from 'crypto'

export async function POST(request: Request){
    await dbConnection();

    try {
        const {username, email, password} = await request.json()

        if([username, email, password].some((field) => field?.trim() === '')){
            return Response.json({
                success: false,
                message: "All fields required",
                status: 400
            })
        }

        const userFindByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(userFindByUsername){
            return Response.json({
                success: false,
                message: "Username already exists",
                status: 400
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10)
        // const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCode = crypto.randomInt(100000, 1000000).toString();

        const userFindByEmail = await UserModel.findOne({
            email
        })

        if(userFindByEmail){
            if(userFindByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists",
                    status: 400
                })
            } else {
                userFindByEmail.password = hashedPassword;
                userFindByEmail.verifyCode = verifyCode;
                userFindByEmail.verifyCodeExpire = expiryTime;

                await userFindByEmail.save();
            }
        } else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire: expiryTime,
                isAcceptingMessage: true,
                isVerified: false,
                messages: [],
            })
            await newUser.save();
        }

        const emailResult = await sendVerificationEmail(username, email, verifyCode);

        if(!emailResult){
            return Response.json({
                success: false,
                message: "Failed to send Email",
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "Verification Code has been sent to your registered Email address",
            status: 201
        })
    } catch (error) {
        console.error("Error Registering User", error);
        return Response.json({
            success: true,
            message: "Error Registering User",
            status: 500
        })
    }
}