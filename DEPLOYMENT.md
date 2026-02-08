# RetailFlow POS - Deployment Guide

Deploy your RetailFlow POS application using **Vercel** (frontend) + **Render** (backend) + **PlanetScale** (database).

---

## 📋 Prerequisites

- GitHub account with your code pushed
- Accounts on [Vercel](https://vercel.com), [Render](https://render.com), and [PlanetScale](https://planetscale.com)

---

## Step 1: Set Up PlanetScale Database

### 1.1 Create Database
1. Go to [PlanetScale](https://planetscale.com) and sign up/login
2. Click **"Create a new database"**
3. Name it `retailflow-pos`
4. Choose the closest region to your users
5. Click **"Create database"**

### 1.2 Get Connection Credentials
1. Click **"Connect"** on your database
2. Select **"Java"** as the connection method
3. Copy the connection details:
   - **Host**: `aws.connect.psdb.cloud` (or similar)
   - **Username**: `your-username`
   - **Password**: `your-password`

### 1.3 Create the Connection String
```
jdbc:mysql://aws.connect.psdb.cloud/retailflow-pos?sslMode=REQUIRED
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
| Instance Type | `Free` (or Starter for better performance) |

### 2.3 Set Environment Variables
Add these in the **"Environment"** section:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `production` |
| `DATABASE_URL` | `jdbc:mysql://aws.connect.psdb.cloud/retailflow-pos?sslMode=REQUIRED` |
| `DATABASE_USERNAME` | Your PlanetScale username |
| `DATABASE_PASSWORD` | Your PlanetScale password |
| `JWT_SECRET` | Generate a secure 64-char hex string |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` (update after frontend deploy) |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for the build to complete (~5-10 minutes first time)
3. Copy your backend URL: `https://retailflow-pos-backend.onrender.com`

### 2.5 Verify Deployment
Visit: `https://your-backend.onrender.com/api/actuator/health`

Should return: `{"status":"UP"}`

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
Add in the **"Environment Variables"** section:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |
| `VITE_APP_NAME` | `RetailFlow POS` |
| `VITE_DEFAULT_TAX_RATE` | `18` |

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for the build (~2-3 minutes)
3. Your frontend URL: `https://your-app.vercel.app`

---

## Step 4: Update CORS Settings

After deploying the frontend, update the backend's CORS setting on Render:

1. Go to your Render web service
2. Navigate to **"Environment"**
3. Update `CORS_ALLOWED_ORIGINS` to your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
4. Click **"Save Changes"** (this will redeploy automatically)

---

## Step 5: Initialize Data (Optional)

After deployment, you may need to create an initial admin user. You can do this by:

1. Using the API directly via Postman/curl
2. Or temporarily enabling data initialization in your backend

---

## 🔧 Troubleshooting

### Backend not starting?
- Check Render logs for errors
- Verify all environment variables are set
- Ensure PlanetScale credentials are correct

### CORS errors?
- Make sure `CORS_ALLOWED_ORIGINS` matches your exact Vercel URL
- Don't include trailing slashes

### Database connection failed?
- PlanetScale requires SSL - ensure `sslMode=REQUIRED` in the URL
- Check your credentials are correct

### Render is slow on free tier?
- Free tier sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to Starter ($7/month) for always-on

---

## 📁 Files Created for Deployment

| File | Purpose |
|------|---------|
| `frontend/vercel.json` | Vercel configuration with SPA routing |
| `backend/Dockerfile` | Docker image for Render |
| `backend/render.yaml` | Render blueprint (optional) |
| `backend/src/main/resources/application-production.properties` | Production Spring config |

---

## 🎉 Done!

Your RetailFlow POS is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`

### Default Login Credentials
After seeding, use these to log in:
- **Admin**: admin@store.com / password123
- **Cashier**: cashier@store.com / password123
