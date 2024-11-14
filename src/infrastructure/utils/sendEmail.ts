import nodemailer from 'nodemailer'
import INodemailer from '../../useCase/interfaces/INodemailer'
import dotenv from 'dotenv'
import { error } from 'console'

dotenv.config()

class sendMail {
    private transporter: nodemailer.Transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS

            }
        })
    }
    sendMail(name: string, email:string, verificationCode: string): void {
        const emailContent = `
        Dear ${name},

        Thank you for choosing Tick Your Tour for your travel needs!
        To ensure the security of your account, we've generated a One-Time Password (OTP) for you to complete your registration  process.

        Your OTP is: ${verificationCode}

        Please use this OTP within the next 5 minutes to complete your registration.

        Thank you for trusting Tick Your Tour for your travel experiences. We look forward to serving you!

        Best regards,
        Tick Your Tour

        `
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Tick Your Tour Verification Code ",
            text: emailContent
        }
        this.transporter.sendMail(mailOptions, (err) => {
            if(err) {
                console.log(err);
                
            } else {
                console.log(`otp: ${verificationCode}`);
                
            }
        })
    }
    forgetSendEmail(email: string, verificationCode: string): void {
        const emailContent = `
        Thank you for choosing Tick Your Tour for your travel needs!
To ensure the security of your account, we've generated a One-Time Password (OTP) for you to complete your registration or login process.

Your OTP is: ${verificationCode}

Please use this OTP within the next 5 minutes to complete your action. If you did not initiate this request or need any assistance, please contact our support team immediately.
Thank you for trusting Tick Your Tour for your travel experiences. We look forward to serving you!

Best regards,
Tick Your Tour`
const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Tick Your Tour Verification Code',
    text: emailContent
}
this.transporter.sendMail(mailOptions, (err) => {
    if(err) {
        console.error(error);
        
    } else {
        console.log(`otp : ${verificationCode}`);
        
    }
})
    }
    sendConfirmationMail(email: string, name: string, startDateFormatted: string, endDateFormatted: string, price: number): void {
        const emailContent = `
        <h2>Invoice</h2>
    <p>Dear ${name},</p>
    <p>Thank you for your reservation. Below is your invoice:</p>
    <table border="1" cellpadding="5">
        <tr>
            <th style="background-color: blue; color: white;">Start Date</th>
            <th style="background-color: blue; color: white;">End Date</th>
            <th style="background-color: blue; color: white;">Price</th>
        </tr>
        <tr>
            <td>${startDateFormatted}</td>
            <td>${endDateFormatted}</td>
            <td>${price}</td>
        </tr>
    </table>
    <p>Total Amount Paid: ${price}</p>
    <p>Thank you for choosing our service.</p>
        `
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Tick Your Tour Booking confirmation',
            html: emailContent
        }
        this.transporter.sendMail(mailOptions, (err) => {
            if(err) {
                console.error(err);
                
            } else {
                console.log('Confirmation mail sent');
                
            }
        })
    }
}
export default sendMail
