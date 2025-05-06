import React from 'react'
import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Message | Verification Code',
            react: React.createElement(VerificationEmail, { username, otp: verifyCode }),
        })
        return {success: true, message: "Verification Email Send Successfully", status:200}
    } catch (emailError) {
        console.error("Error sending verification Email", emailError)
        return {success: false, message: "Failed to send verification email", status:500}
    }
}


