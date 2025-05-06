import UserModel from "@/model/user.model";
import dbConnection from "@/lib/db";
import {z} from 'zod';
import {usernameValidation} from '@/schema/signup.schema';


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET (request: Request){
    await dbConnection();

    try {
        const {searchParams} = new URL(request.url);

        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid Query Parameters',
                status: 500
            })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username Already Taken',
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: 'Username is Unique',
            status: 200
        })
    } catch (error) {
        console.error("Error Checking Username", error);
        return Response.json({
            success: false,
            message: "Error Checking Username",
            status: 500
        })
    }
}