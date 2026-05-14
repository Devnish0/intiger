import resend from "../config/resend.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface OtpEmailData {
  email: string;
  otpHash: string;
}

const sendOtpEmail = asyncHandler(async ({ email, otpHash }: OtpEmailData) => {
  const data = await resend.emails.send({
    from: "no-reply@nishank.dev",
    to: email,
    subject: "Your OTP Code",
    text: `Here is your OTP code: ${otpHash}`,
  });
  return data;
});

export { sendOtpEmail };
