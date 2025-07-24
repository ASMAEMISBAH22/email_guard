# Frontend Deployment Guide - Vercel + Replit Backend

## 🚀 Deployment Strategy

- **Frontend (React)**: Deployed on Vercel
- **Backend (FastAPI)**: Deployed on Replit at `https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev`

## 📋 Pre-deployment Checklist

### ✅ Configuration Updates Made

1. **API Configuration** (`src/services/api.js`)
   - Updated default API URL to point to Replit backend
   - Maintains environment variable support for flexibility

2. **Vercel Configuration** (`vercel.json`)
   - Set `REACT_APP_API_URL` environment variable
   - Configured for Create React App framework

3. **Package Configuration** (`package.json`)
   - Removed proxy configuration (not needed for Vercel)

## 🛠️ Deployment Steps

### 1. Push to GitHub
```bash
cd frontend
git add .
git commit -m "Configure frontend for Vercel deployment with Replit backend"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set project name: email-guardian-frontend
# - Confirm deployment settings
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3. Environment Variables (Optional)
If you need to override the API URL in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev`

## 🔧 Local Development

For local development, create a `.env.local` file in the frontend directory:
```bash
REACT_APP_API_URL=https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev
```

## 🧪 Testing the Deployment

1. **Test API Connection**
   - Visit your Vercel deployment URL
   - Try the "Demo Analysis" feature (no API key required)
   - Verify results are returned from Replit backend

2. **Test API Key Features**
   - Generate an API key through the frontend
   - Test protected endpoints
   - Verify scan history functionality

## 🔒 CORS Configuration

The Replit backend should already be configured to accept requests from:
- `localhost:3000` (local development)
- `*.vercel.app` (Vercel deployments)
- Your custom domain (if configured)

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Backend Health**: Check Replit backend status
- **API Response Times**: Monitor through browser dev tools

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check if backend CORS is configured for Vercel domain
   - Verify API URL is correct

2. **API Key Issues**
   - Ensure API keys are being stored/retrieved correctly
   - Check localStorage in browser dev tools

3. **Build Failures**
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

### Support:
- Vercel Documentation: https://vercel.com/docs
- Replit Documentation: https://docs.replit.com

## 🎉 Success!

Once deployed, your Email Guardian will be accessible at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev` 