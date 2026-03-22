require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

const { connectDB } = require('./config/db');
const serverConfig = require('./config/serverConfig');
const backupConfig = require('./config/backupConfig');
const { errorHandler } = require('./middleware/errorMiddleware');
const { runBackup } = require('./utils/backupUtility');

// Routes
const superadminRoutes = require('./routes/superadminRoutes');
const mainAdminRoutes = require('./routes/mainAdminRoutes');
const schoolAdminRoutes = require('./routes/schoolAdminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Connect to database
connectDB();

// Security & middleware
app.use(helmet());
app.use(cors({
  origin: serverConfig.allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: serverConfig.serverName,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/superadmin', superadminRoutes);
app.use('/api/main-admin', mainAdminRoutes);
app.use('/api/school-admin', schoolAdminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Automated backups via cron
cron.schedule(backupConfig.dailySchedule, () => {
  console.log('[CRON] Running daily backup...');
  runBackup('daily');
});
cron.schedule(backupConfig.weeklySchedule, () => {
  console.log('[CRON] Running weekly backup...');
  runBackup('weekly');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 LMS Server running on port ${PORT}`);
  console.log(`   Server: ${serverConfig.serverName}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API: http://localhost:${PORT}/api\n`);
});

module.exports = app;
