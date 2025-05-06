import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/db";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Username or Email" },
                password: { label: "Password", type: "password"}
            },

            async authorize(credentials: any): Promise<any>{
                await dbConnection();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("User Doesn't exist with this email");
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your email before Signin")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    } else {
                        throw new Error("Invalid Credentials");
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString(),
                token.username = user.username,
                token.isVerified = user.isVerified,
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id,
                session.user.username = token.username,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }
            return session;
        }
        
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET
}