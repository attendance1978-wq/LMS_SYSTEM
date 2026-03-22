# LMS System — Server Setup Guide
## Main Server: Surigao del Norte (Region XIII – Caraga)

---

## Requirements

- Ubuntu 20.04+ / CentOS 8+
- Node.js 18+
- MySQL 8.0+
- Nginx
- PM2

---

## 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version && npm --version
```

## 2. Install MySQL

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
mysql -u root -p
```

```sql
CREATE DATABASE lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lms_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON lms_db.* TO 'lms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Import Database

```bash
mysql -u lms_user -p lms_db < /var/www/lms-system/database/schema.sql
mysql -u lms_user -p lms_db < /var/www/lms-system/database/seed.sql
```

## 4. Install Nginx & PM2

```bash
sudo apt install nginx -y
sudo npm install -g pm2
```

## 5. Deploy Application

```bash
cd /var/www
sudo git clone <your-repo-url> lms-system
sudo chown -R $USER:$USER lms-system
cd lms-system

# Backend
cd backend
cp .env.example .env
nano .env  # fill in DB credentials, JWT secret, etc.
npm install --production

# Frontend
cd ../frontend
npm install
npm run build
```

## 6. Configure Nginx

```bash
sudo cp /var/www/lms-system/deployment/nginx/lms.conf /etc/nginx/sites-available/lms
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7. Start with PM2

```bash
cd /var/www/lms-system
pm2 start deployment/pm2/ecosystem.config.js --env production
pm2 save
pm2 startup  # follow printed command to auto-start on reboot
```

## 8. SSL Certificate (optional but recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## Useful Commands

| Task | Command |
|------|---------|
| View logs | `pm2 logs lms-backend` |
| Restart app | `pm2 restart lms-backend` |
| Stop app | `pm2 stop lms-backend` |
| Manual backup | `cd backend && node utils/backupUtility.js daily` |
| Restore backup | `cd backend && node utils/backupUtility.js restore <filepath>` |
| Nginx status | `sudo systemctl status nginx` |
| MySQL status | `sudo systemctl status mysql` |

---

## Backup Schedule (auto-configured)

- **Daily** — Every day at 2:00 AM → `deployment/backups/daily/` (keeps last 7)
- **Weekly** — Every Sunday at 3:00 AM → `deployment/backups/weekly/` (keeps last 4)
