const nodemailer = require("nodemailer");
const { HTML_TEMPLATE, CONTRIBUTE_HTML } = require("./html-template");
const dotenv = require("dotenv");
dotenv.config();

const { MAIL_SERVER, MAIL_PASS } = process.env;

function createTransporter() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true cho port 465, false cho port 587
    auth: {
      user: MAIL_SERVER,
      pass: MAIL_PASS,
    },
  });
  return transporter;
}

// Modify the email sending functions to use the transporter
const sendForgetPasswordMail = async (user, new_password) => {
  try {
    const transporter = createTransporter();
    const options = {
      to: user.email,
      subject: "Quên mật khẩu",
      html: HTML_TEMPLATE(
        user.displayName || "Người ẩn danh",
        new_password,
        "Mật khẩu tạm thời",
        "Vui lòng đăng nhập để thay đổi mật khẩu mới"
      ),
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
};

const sendOTPMail = async (user) => {
  try {
    const transporter = createTransporter();
    const options = {
      to: user.email,
      subject: "Xác thực OTP",
      html: HTML_TEMPLATE(
        user.displayName || "Người ẩn danh",
        user.otp,
        "Mã OTP",
        "Mã OTP chỉ có hiệu lực trong 10 phút"
      ),
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
};

const sendFeedbackMail = async (username, feedback) => {
  try {
    const transporter = createTransporter();
    const options = {
      to: "khanhbk0102@gmail.com",
      subject: "Thư cảm ơn bạn đã phản hồi cũng như đóng góp",
      html: CONTRIBUTE_HTML(username, feedback),
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendForgetPasswordMail, sendOTPMail, sendFeedbackMail };
