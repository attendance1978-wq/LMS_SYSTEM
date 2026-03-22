module.exports = {
  serverName: 'LMS Main Server - Surigao del Norte',
  serverAddress: process.env.SERVER_ADDRESS || 'http://localhost',
  port: process.env.PORT || 5000,
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  jwtSecret: process.env.JWT_SECRET || 'lms_default_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  locations: ['Surigao City', 'San Ricardo'],
  academicYear: {
    current: '2024-2025',
    semesters: ['1st Semester', '2nd Semester', 'Summer'],
  },
};
