import nodemailer from 'nodemailer'

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'golamrabbani7235@gmail.com',
      pass: 'obuc jkwd hmtz aeqf',
    },
  })

  await transporter.sendMail({
    from: 'golamrabbani7235@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 5 mins!', // Subject line
    text: '', // plain text body
    html, // html body
  })
}
