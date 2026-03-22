const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'LMS System <noreply@lms.edu.ph>',
      to,
      subject,
      html,
      text,
    });
    console.log(`[EMAIL] Sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('[EMAIL] Failed:', error.message);
    throw error;
  }
};

const sendWelcomeEmail = (user) => sendEmail({
  to: user.email,
  subject: 'Welcome to LMS - Your Account is Ready',
  html: `<h2>Welcome, ${user.first_name}!</h2>
    <p>Your LMS account has been created.</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Role:</strong> ${user.role}</p>
    <p>Please login and change your password.</p>`,
});

const sendEnrollmentEmail = (student, course) => sendEmail({
  to: student.email,
  subject: `Enrollment Confirmed - ${course.name}`,
  html: `<h2>Enrollment Confirmed</h2>
    <p>Dear ${student.first_name},</p>
    <p>You have been enrolled in <strong>${course.name}</strong> (${course.code}).</p>
    <p>Schedule: ${course.schedule || 'TBA'}</p>`,
});

module.exports = { sendEmail, sendWelcomeEmail, sendEnrollmentEmail };
