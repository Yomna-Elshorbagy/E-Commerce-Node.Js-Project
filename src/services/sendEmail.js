

import nodemailer from 'nodemailer';
import { emailtemplet } from './emailtemplete.js';

const transporter = nodemailer.createTransport({

    service:"gmail",
    // secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SENDEMAIL,
      pass:  process.env.SENDEMAILPASSWORD,
    },
  });



  async function sendOurEmail(email, url) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <yomnaelshorbage@gmail.COM>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: emailtemplet(url), // html body
    });
  
    console.log("Message sent: %s", info.messageId);

  }

export async function sendResetPasswordMail(name, email, code) {
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <yomnaelshorbage@gmail.com>',
        to: email,
        subject: "Reset Password ✔",
        text: "Hello world?",
        html: `<p>Hi, '${name}' your verification code is: ${code}</p>`,
    });

    console.log("Message sent:", info.messageId);
}


export {
  sendOurEmail
};