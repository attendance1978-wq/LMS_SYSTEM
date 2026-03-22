const path = require('path');

module.exports = {
  backupDir: process.env.BACKUP_DIR || path.join(__dirname, '../../deployment/backups'),
  dailyDir: path.join(process.env.BACKUP_DIR || '../../deployment/backups', 'daily'),
  weeklyDir: path.join(process.env.BACKUP_DIR || '../../deployment/backups', 'weekly'),
  dailySchedule: '0 2 * * *',    // Every day at 2:00 AM
  weeklySchedule: '0 3 * * 0',   // Every Sunday at 3:00 AM
  maxDailyBackups: 7,
  maxWeeklyBackups: 4,
  dbName: process.env.DB_NAME || 'lms_db',
  dbUser: process.env.DB_USER || 'root',
  dbPass: process.env.DB_PASS || '',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 3306,
};
