# 🚀 Render Deployment Guide

## Deploy Email Guardian Backend to Render

### Prerequisites
- GitHub account with your Email Guardian repository
- Render account (free at [render.com](https://render.com))

### Step 1: Prepare Your Repository

Make sure your repository has these files:
```
email_guard/
├── backend/
│   └── app.py
├── ai/
│   └── email_guard.py
├── requirements.txt
├── render.yaml (optional)
├── Procfile
└── runtime.txt
```

### Step 2: Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy

#### Option B: Manual Deployment
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `email-guardian-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

### Step 3: Environment Variables (Optional)

Add these environment variables in Render dashboard:
- `PYTHON_VERSION`: `3.11.0`
- `PORT`: `8000` (auto-set by Render)

### Step 4: Deploy Frontend (Optional)

To deploy the React frontend on Render:

1. Create a new Web Service
2. Configure:
   - **Name**: `email-guardian-frontend`
   - **Environment**: `Static Site`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

### Step 5: Test Your Deployment

Once deployed, your API will be available at:
```
https://your-app-name.onrender.com
```

#### Test Endpoints:
```bash
# Health check
curl https://your-app-name.onrender.com/health

# Create API key
curl -X POST "https://your-app-name.onrender.com/create-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test App"}'

# Scan email (replace YOUR_API_KEY)
curl -X POST "https://your-app-name.onrender.com/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'
```

### Step 6: Update Frontend Configuration

If you deployed the frontend, update the API URL in `frontend/src/components/EmailScanner.js`:

```javascript
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

### Troubleshooting

#### Common Issues:

1. **Build Fails**: Check that all dependencies are in `requirements.txt`
2. **Import Errors**: Ensure file paths are correct
3. **CORS Errors**: Verify CORS origins in `backend/app.py`
4. **Memory Issues**: Render free tier has 512MB RAM limit

#### Logs:
- View logs in Render dashboard under your service
- Check build logs for dependency issues
- Monitor runtime logs for errors

### Performance Tips

1. **Model Loading**: The AI model loads on first request (may take 30-60 seconds)
2. **Cold Starts**: Free tier services sleep after 15 minutes of inactivity
3. **Database**: SQLite file is ephemeral on Render - data resets on redeploy

### Security Notes

- API keys are stored securely with SHA-256 hashing
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS is configured for production domains

### Cost

- **Free Tier**: 750 hours/month (enough for continuous deployment)
- **Paid Plans**: Start at $7/month for always-on services

### Next Steps

1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up CI/CD for automatic deployments
4. Add environment-specific configurations

---

**🎉 Your Email Guardian API is now live on Render!** 