const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ny9950610@gmail.com',
    pass: 'pwmd kuce quqo fjrd'
  }
});

class MailUtil {
  static async send(mail, subject, text) {
    const mailOptions = {
      from: 'ny9950610@gmail.com',
      to: mail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = MailUtil;