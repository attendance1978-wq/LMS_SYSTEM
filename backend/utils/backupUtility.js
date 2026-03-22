const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const backupConfig = require('../config/backupConfig');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const cleanOldBackups = (dir, maxFiles) => {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({ name: f, time: fs.statSync(path.join(dir, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);
  files.slice(maxFiles).forEach(f => {
    fs.unlinkSync(path.join(dir, f.name));
    console.log(`[BACKUP] Removed old backup: ${f.name}`);
  });
};

const runBackup = (type = 'daily') => {
  const dir = type === 'weekly' ? backupConfig.weeklyDir : backupConfig.dailyDir;
  ensureDir(dir);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `lms_backup_${type}_${timestamp}.sql`;
  const filepath = path.join(dir, filename);
  const cmd = `mysqldump -h ${backupConfig.dbHost} -P ${backupConfig.dbPort} -u ${backupConfig.dbUser} ${backupConfig.dbPass ? `-p${backupConfig.dbPass}` : ''} ${backupConfig.dbName} > "${filepath}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`[BACKUP] ❌ ${type} backup failed:`, error.message);
      return;
    }
    console.log(`[BACKUP] ✅ ${type} backup saved: ${filename}`);
    const maxFiles = type === 'weekly' ? backupConfig.maxWeeklyBackups : backupConfig.maxDailyBackups;
    cleanOldBackups(dir, maxFiles);
  });
};

const restoreBackup = (filepath) => {
  if (!fs.existsSync(filepath)) {
    console.error('[RESTORE] File not found:', filepath);
    return;
  }
  const cmd = `mysql -h ${backupConfig.dbHost} -P ${backupConfig.dbPort} -u ${backupConfig.dbUser} ${backupConfig.dbPass ? `-p${backupConfig.dbPass}` : ''} ${backupConfig.dbName} < "${filepath}"`;
  exec(cmd, (error) => {
    if (error) {
      console.error('[RESTORE] ❌ Restore failed:', error.message);
      return;
    }
    console.log('[RESTORE] ✅ Database restored from:', filepath);
  });
};

const listBackups = (type = 'daily') => {
  const dir = type === 'weekly' ? backupConfig.weeklyDir : backupConfig.dailyDir;
  ensureDir(dir);
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: path.join(dir, f),
      size: `${(fs.statSync(path.join(dir, f)).size / 1024).toFixed(2)} KB`,
      created: fs.statSync(path.join(dir, f)).mtime,
    }))
    .sort((a, b) => b.created - a.created);
};

if (require.main === module) {
  const type = process.argv[2] || 'daily';
  if (type === 'restore' && process.argv[3]) {
    restoreBackup(process.argv[3]);
  } else {
    runBackup(type);
  }
}

module.exports = { runBackup, restoreBackup, listBackups };
