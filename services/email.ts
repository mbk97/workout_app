import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Port for secure SMTP
  secure: false,
  //   secureConnection: false,
  auth: {
    user: "oyindamola850@gmail.com", // Your email address
    pass: "fzsz mbxr lhcm dcef", // Your email password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: "oyindamola850@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
