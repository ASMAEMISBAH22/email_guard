# Vercel + Replit Deployment Guide

This guide will help you deploy the Smart Email Guardian project with the frontend on Vercel and the backend on Replit.

## 🚀 Quick Start

1. **Deploy Backend on Replit** (Step 1)
2. **Deploy Frontend on Vercel** (Step 2)
3. **Connect Frontend to Backend** (Step 3)

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Replit account (free)
- Git installed locally

---

## 🔧 Step 1: Deploy Backend on Replit

### 1.1 Create a New Repl

1. Go to [replit.com](https://replit.com) and sign in
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Enter your repository URL: `https://github.com/ASMAEMISBAH22/email_guard`
5. Select "Python" as the language
6. Click "Import from GitHub"

### 1.2 Configure the Backend

1. In your Repl, navigate to the `backend` folder
2. The `.replit` file should already be configured correctly
3. The `requirements.txt` is already set up for Replit

### 1.3 Set Environment Variables

1. In your Repl, click on "Tools" → "Secrets"
2. Add the following environment variables:
   ```
   PYTHONPATH=/home/runner/$REPL_SLUG
   ```

### 1.4 Run the Backend

1. Click the "Run" button in your Repl
2. Wait for the dependencies to install (this may take a few minutes)
3. The server will start on port 8000
4. Copy the Replit URL (e.g., `https://your-repl-name.your-username.repl.co`)

### 1.5 Test the Backend

1. Visit your Replit URL + `/health` (e.g., `https://your-repl-name.your-username.repl.co/health`)
2. You should see a health check response
3. Note down your Replit URL - you'll need it for the frontend

---

## 🌐 Step 2: Deploy Frontend on Vercel

### 2.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `ASMAEMISBAH22/email_guard`
4. Select the repository and click "Import"

### 2.2 Configure Build Settings

1. In the project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

2. Click "Deploy"

### 2.3 Set Environment Variables

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add the following variable:
   ```
   Name: REACT_APP_API_URL
   Value: https://your-repl-name.your-username.repl.co
   Environment: Production, Preview, Development
   ```
3. Replace `your-repl-name.your-username.repl.co` with your actual Replit URL

### 2.4 Redeploy

1. Go to "Deployments" tab
2. Click "Redeploy" on your latest deployment
3. Wait for the build to complete

---

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Update Frontend API Configuration

The frontend is already configured to use the `REACT_APP_API_URL` environment variable. Make sure your Vercel environment variable is set correctly.

### 3.2 Test the Connection

1. Visit your Vercel frontend URL
2. Try scanning an email
3. Check the browser's developer tools (F12) → Network tab to ensure API calls are going to your Replit backend

---

## 🔑 API Key Management

### Get Your API Key

1. Visit your Replit backend URL + `/create-key`
2. Send a POST request with:
   ```json
   {
     "name": "my-app",
     "description": "Frontend application"
   }
   ```
3. Copy the returned API key

### Use the API Key

1. In your frontend, you'll need to include this API key in requests
2. The frontend should store this securely (consider using localStorage or a secure environment variable)

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem**: Dependencies not installing
- **Solution**: Check the `requirements.txt` file and ensure all packages are compatible with Replit

**Problem**: Server not starting
- **Solution**: Check the Replit console for error messages. Common issues include port conflicts or missing environment variables.

**Problem**: CORS errors
- **Solution**: The backend already includes CORS middleware configured for frontend origins.

### Frontend Issues

**Problem**: Build failing
- **Solution**: Check the Vercel build logs for dependency issues or build errors.

**Problem**: API calls failing
- **Solution**: 
  1. Verify the `REACT_APP_API_URL` environment variable is set correctly
  2. Check that your Replit backend is running
  3. Ensure CORS is properly configured

**Problem**: Environment variables not loading
- **Solution**: Redeploy the frontend after setting environment variables.

---

## 🔒 Security Considerations

1. **API Keys**: Store API keys securely and never commit them to version control
2. **CORS**: The backend is configured to allow requests from Vercel domains
3. **Rate Limiting**: The backend includes rate limiting to prevent abuse
4. **Input Validation**: All inputs are validated on both frontend and backend

---

## 📊 Monitoring

### Backend Monitoring
- Check Replit's built-in monitoring tools
- Monitor the console for errors and performance issues

### Frontend Monitoring
- Use Vercel's analytics and performance monitoring
- Check browser developer tools for client-side errors

---

## 🔄 Updates and Maintenance

### Backend Updates
1. Make changes to your code
2. Commit and push to GitHub
3. Replit will automatically pull the latest changes
4. Restart the Repl if necessary

### Frontend Updates
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically deploy the changes

---

## 💰 Cost Considerations

- **Vercel**: Free tier includes unlimited deployments and 100GB bandwidth
- **Replit**: Free tier includes 500MB RAM and 0.5 vCPU
- Both platforms offer paid plans for additional resources

---

## 🎉 Success!

Your Smart Email Guardian is now deployed with:
- ✅ Frontend on Vercel (fast, global CDN)
- ✅ Backend on Replit (easy deployment, good for Python)
- ✅ Secure API communication
- ✅ Environment-based configuration

The application is now accessible to users worldwide! 🌍 