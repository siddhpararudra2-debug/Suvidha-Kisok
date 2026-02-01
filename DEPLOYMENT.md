# 🚀 Deployment Guide: Real-Time Full Stack

This guide explains how to deploy the **Backend (Node.js + Database)** to the cloud so your application works with **Real Data** and **Real-Time Sync** online.

## Architecture
- **Frontend (Consumer/Admin):** Hosted on **GitHub Pages** (Already done).
- **Backend (API):** Hosted on **Render.com** (Free Tier).
- **Database (PostgreSQL):** Hosted on **Render.com** (Free Tier).
- **Cache (Redis):** Hosted on **Render.com** (Free Tier).

---

## Step 1: Deploy Backend to Render

I have already created a **Blueprint** (`render.yaml`) that automates everything.

1.  **Push your latest code** to GitHub (I will do this in the next step).
2.  Sign up for [Render.com](https://render.com/).
3.  Go to **Blueprints** and click **New Blueprint Instance**.
4.  Connect your GitHub repository (`Suvidha-Kisok`).
5.  Render will automatically detect `render.yaml`.
6.  Click **Apply**.
    - This will create: `suvidha-db` (Database), `suvidha-redis`, and `suvidha-backend`.
    - It connects them automatically using private networking.
7.  **Wait ~5-10 minutes** for the deployment to finish.

## Step 2: Get your Backend URL

Once deployed on Render:
1.  Click on the **suvidha-backend** service in the Dashboard.
2.  Copy the URL (e.g., `https://suvidha-backend.onrender.com`).

## Step 3: Connect Frontend to Real Backend

Now you need to tell your GitHub Pages frontend to talk to this new real backend instead of `localhost` or `mock data`.

1.  Open `frontend/.env.production` (create if missing) and `admin-frontend/.env.production`.
2.  Add/Update the line:
    ```env
    VITE_API_URL=https://your-backend-url-from-step-2.onrender.com/api
    ```
    *(Note: Make sure to verify if your backend routes start with /api or not. In our code, `src/index.ts` uses `/api/auth`, keeping `/api` in the base URL is usually correct).*

3.  **Push these changes to GitHub.**
    - GitHub Actions will re-build your site.
    - Your live link `https://...github.io/Suvidha-Kisok/` will now talk to the Real Cloud Backend!

## Step 4: Verify Real-Time Sync

1.  Open the **Consumer Portal** on one device/tab.
2.  Open the **Admin Portal** on another.
3.  Login to Admin (`admin` / `admin123`).
4.  Update a Complaint status.
5.  Watch it update **instantly** on the Consumer Portal without refreshing!

---

## 🛠 Troubleshooting

- **Backend Logs:** Check "Logs" tab in Render Dashboard to see if the server started (`SUVIDHA Backend running on port 10000`).
- **Database Tables:** The app is configured to **automatically create tables** on startup (`initializeDatabase` function). You don't need to run SQL manually.
- **CORS Errors:** If you see CORS errors in browser console, make sure `CORS_ORIGIN` in `render.yaml` matches your GitHub Pages URL `https://<username>.github.io`.
