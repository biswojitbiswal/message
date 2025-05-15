import dbConnection from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import UserModel from "@/model/user.model";
import {User} from 'next-auth'
import mongoose from "mongoose";


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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "Message Not Found",
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Messages Fetch successfully",
            data: user,
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