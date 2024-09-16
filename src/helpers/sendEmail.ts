import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/apiResponse";
import { url } from "inspector";
import { checkIsOnDemandRevalidate } from "next/dist/server/api-utils";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'kdagur36@gmail.com',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return { success: true, message: "Verification code sent successfully" }
    } catch (emailError) {
        console.error("Error in sending email", emailError);
        return { success: false, message: "Failed to send verification code" }
    }
}