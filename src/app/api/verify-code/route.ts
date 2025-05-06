import UserModel from "@/model/user.model";
import dbConnection from "@/lib/db";

export async function POST (request: Request){
    await dbConnection();

    try {
        const {username, code} = await request.json();

        const decodeUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username: decodeUsername,
        });

        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found",
                status: 404
            })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true,
            user.verifyCode = ''

            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified Successfully",
                status: 200
            })
        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification Code Has Expired",
                status: 400
            })
        } else {
            return Response.json({
                success: false,
                message: "Invalid Verification Code",
                status: 400
            })
        }

    } catch (error) {
        console.error("Error Verifying Code", error);
        return Response.json({
            success: false,
            message: "Error Verifying Code",
            status: 500
        });
    }
}