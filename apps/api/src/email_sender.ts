import { createTransport } from "nodemailer";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let options: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};
const transporter = createTransport(options);

export async function sendEmail(pdf : ArrayBufferLike){
  try{
    const info = await transporter.sendMail({
      from : process.env.FROM_EMAIL,
      to : process.env.TO_EMAIL,
      subject: `Relatório Comodatos`,
      text: `O relatório segue em anexo`,
      attachments: [{
        content: Buffer.from(pdf),
        contentType: "application/pdf"
      }]
    });
  }
  catch (e){
    console.log(e);
  }
}
