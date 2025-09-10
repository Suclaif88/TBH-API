// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // o SMTP
  auth: {
    user: "thebarberhouse2000@gmail.com",
    pass: "qqhp khes bldi rihj"
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS
  }
});

exports.sendMail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: `"Mi App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};


