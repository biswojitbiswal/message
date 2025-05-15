import dbConnection from "@/lib/db";
import UserModel from "@/model/user.model";
import {Message} from '@/model/user.model'

export async function POST (request: Request){
    await dbConnection();

    try {
        const {username, content} = await request.json();

        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found",
                status: 404
            })
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User Not Accepting Message",
                status: 401
            })
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message Sent Successfully",
            status: 200
        })
    } catch (error) {
        console.log("Error Adding Message", error)
        return Response.json({
            success: false,
            message: "Error Adding Message",
            status: 500
        })
    }
}