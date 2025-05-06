import dbConnection from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/model/user.model";
import {User} from 'next-auth';


export async function POST(request: Request){
    await dbConnection();
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "Not Authenticated",
            status: 401
        })
    }

    const userId = user._id;
    const {acceptMessage} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessage},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User Not Found || Status Not Updated",
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "User Status Updated Successfully",
            status: 200
        })
    } catch (error) {
        console.log("Failed To Update User Status To Accept Message", error)
        return Response.json({
            success: false,
            message: "Failed To Update User Status To Accept Message",
            status: 500
        })
    }
}


export async function GET(request: Request){
    await dbConnection();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "Not Authenticated",
            status: 401
        })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
            return Response.json({
                success: false,
                message: "User Not Found",
                status: 404
            })
        }

        return Response.json({
            success: false,
            message: "User Found Successfully",
            status: 200
        })
    } catch (error) {
        console.log("Failed To Get User", error)
        return Response.json({
            success: false,
            message: "Failed To Get User",
            status: 500
        })
    }
}