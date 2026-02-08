# RetailFlow POS - Deployment Guide

Deploy your RetailFlow POS application using **Vercel** (frontend) + **Render** (backend) + **AWS RDS** (database).

---

## 📋 Prerequisites

- GitHub account with your code pushed
- Accounts on [Vercel](https://vercel.com), [Render](https://render.com), and [AWS](https://aws.amazon.com)

---

## Step 1: Set Up AWS RDS MySQL Database

### 1.1 Create RDS Instance
1. Go to [AWS Console](https://console.aws.amazon.com) → Search **"RDS"**
2. Click **"Create database"**
3. Choose **"Standard create"**
4. Select **"MySQL"** as the engine
5. Choose **"Free tier"** template

### 1.2 Configure Settings
| Setting | Value |
|---------|-------|
| DB instance identifier | `retailflow-pos` |
| Master username | `admin` |
| Master password | Create a strong password |
| DB instance class | `db.t3.micro` (free tier) |
| Storage | 20 GB (free tier) |

### 1.3 Connectivity Settings
1. **Public access**: Select **"Yes"** (required for Render to connect)
2. **VPC security group**: Create new or use existing
3. Click **"Create database"**

### 1.4 Configure Security Group
After RDS is created:
1. Click on your database instance
2. Go to **"Connectivity & security"** tab
3. Click on the **VPC security group**
4. Edit **Inbound rules** → Add rule:
   - Type: `MySQL/Aurora`
   - Port: `3306`
   - Source: `0.0.0.0/0` (allows all IPs - for Render access)
5. Save rules

### 1.5 Get Connection Details
From RDS dashboard, note down:
- **Endpoint**: `retailflow-pos.xxxx.us-east-1.rds.amazonaws.com`
- **Port**: `3306`
- **Username**: `admin`
- **Password**: (your password)

### 1.6 Create the Database
Connect using MySQL client or DBeaver:
```sql
CREATE DATABASE retailflow_pos;
```

Your connection URL will be:
```
jdbc:mysql://retailflow-pos.xxxx.us-east-1.rds.amazonaws.com:3306/retailflow_pos
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **backend** folder as root directory

### 2.2 Configure Build Settings
| Setting | Value |
|---------|-------|
| Name | `retailflow-pos-backend` |
| Root Directory | `backend` |
| Environment | `Docker` |
| Dockerfile Path | `./Dockerfile` |
| Instance Type | `Free` |

### 2.3 Set Environment Variables
Add these in the **"Environment"** section:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `production` |
| `DATABASE_URL` | `jdbc:mysql://your-rds-endpoint:3306/retailflow_pos` |
| `DATABASE_USERNAME` | `admin` |
| `DATABASE_PASSWORD` | Your RDS password |
| `JWT_SECRET` | Generate: 64-character hex string |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |

**To generate JWT_SECRET**, run in PowerShell:
```powershell
-join ((48..57) + (65..70) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for the build (~5-10 minutes)
3. Copy your URL: `https://retailflow-pos-backend.onrender.com`

### 2.5 Verify
Visit: `https://your-backend.onrender.com/api/actuator/health`

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository

### 3.2 Configure Build Settings
| Setting | Value |
|---------|-------|
| Framework Preset | `Vite` |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 3.3 Set Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |
| `VITE_APP_NAME` | `RetailFlow POS` |
| `VITE_DEFAULT_TAX_RATE` | `18` |

### 3.4 Deploy
1. Click **"Deploy"**
2. Your URL: `https://your-app.vercel.app`

---

## Step 4: Update CORS

1. Go to Render → Your web service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS` to your Vercel URL
3. Save (auto-redeploys)

---

## 🔧 Troubleshooting

### Cannot connect to RDS?
- Ensure **Public accessibility** is enabled
- Check security group allows inbound on port 3306
- Verify the endpoint URL is correct

### Backend times out?
- Free tier Render sleeps after 15 min
- First request takes ~30 seconds to wake up

### CORS errors?
- Ensure exact Vercel URL (no trailing slash)
- Redeploy backend after updating CORS

---

## 💰 AWS Free Tier Limits (12 months)

| Resource | Free Limit |
|----------|------------|
| RDS db.t3.micro | 750 hours/month |
| Storage | 20 GB |
| Backup | 20 GB |

**After 12 months**: ~$15-25/month for db.t3.micro

---

## 🎉 Done!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com/api`
- **Database**: AWS RDS MySQL

### Login Credentials
- **Admin**: admin@store.com / password123
- **Cashier**: cashier@store.com / password123
