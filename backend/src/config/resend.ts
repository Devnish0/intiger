import { Resend } from "resend";
const token = process.env.RESEND_API!;
const resend: any = new Resend(token);

export default resend;
