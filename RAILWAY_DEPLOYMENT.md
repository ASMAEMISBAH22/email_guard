# 🚀 Railway Deployment Guide (Free Tier - No Credit Card Required)

## Deploy Email Guardian Backend to Railway

### Prerequisites
- GitHub account with your Email Guardian repository
- Railway account (free at [railway.app](https://railway.app))

### Step 1: Create Railway Account

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub** (no credit card required)
3. **Verify your email**

### Step 2: Create New Project

1. **Click "New Project"**
2. **Choose "Deploy from GitHub repo"**
3. **Select your repository:** `asmaemisbah12/email-guard`
4. **Click "Deploy Now"**

### Step 3: Configure Environment

Railway will automatically detect your Python project and configure:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- **Health Check:** `/health` endpoint

### Step 4: Environment Variables (Optional)

In Railway dashboard → Variables, add:
```bash
PYTHON_VERSION=3.11
ENVIRONMENT=production
LOG_LEVEL=info
```

### Step 5: Deploy

1. **Railway will automatically build and deploy**
2. **Wait for deployment to complete** (2-5 minutes)
3. **Your API will be live!**

### Step 6: Get Your API URL

Your API will be available at:
```
https://your-project-name.railway.app
```

### Step 7: Test Your Deployment

#### Test Endpoints:
```bash
# Health check
curl https://your-project-name.railway.app/health

# Create API key
curl -X POST "https://your-project-name.railway.app/create-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test App"}'

# Scan email (replace YOUR_API_KEY)
curl -X POST "https://your-project-name.railway.app/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'

# Get history
curl "https://your-project-name.railway.app/history?limit=10"
```

## 🔧 Railway Features

### 1. Automatic Deployments
- **GitHub integration** - Deploy on every push
- **Preview deployments** - Test changes before production
- **Rollback** - Easy version management

### 2. Environment Management
- **Environment variables** - Secure configuration
- **Secrets management** - Encrypted sensitive data
- **Multiple environments** - Dev, staging, production

### 3. Monitoring & Logs
- **Real-time logs** - View application output
- **Metrics dashboard** - CPU, memory, network usage
- **Health checks** - Automatic monitoring

### 4. Database Integration
- **PostgreSQL** - Managed database service
- **Redis** - Caching and sessions
- **MongoDB** - NoSQL database

## 💰 Railway Free Tier

### Compute
- **$5 credit/month** (enough for small apps)
- **Shared CPU** - Good for development
- **512MB RAM** - Sufficient for Email Guardian

### Database
- **PostgreSQL** - 1GB storage
- **Redis** - 100MB storage
- **MongoDB** - 512MB storage

### Networking
- **Custom domains** - Free SSL certificates
- **Global CDN** - Fast worldwide access
- **Load balancing** - Automatic scaling

## 🎯 Advantages of Railway

✅ **No credit card required**  
✅ **$5 free credit/month**  
✅ **Automatic deployments**  
✅ **Built-in databases**  
✅ **Custom domains**  
✅ **Real-time monitoring**  
✅ **Easy scaling**  

## 🔒 Security Features

- **Environment variables** for sensitive data
- **Automatic HTTPS** with custom domains
- **Isolated environments** for each deployment
- **Git-based deployments** with version control

## 🚀 Performance Features

- **Global CDN** for fast access
- **Automatic scaling** based on traffic
- **Health checks** for reliability
- **Load balancing** for high availability

## 📊 Monitoring

- **Real-time logs** in Railway dashboard
- **Resource usage** monitoring
- **Deployment history** and rollbacks
- **Custom metrics** and alerts

## 🔧 Local Development

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy locally
railway up

# View logs
railway logs
```

## 📈 Scaling

When you exceed free tier:
- **Pay-as-you-go** pricing
- **Automatic scaling** based on usage
- **No upfront costs** or commitments

## 🎉 Next Steps

1. **Set up custom domain** (optional)
2. **Configure monitoring** and alerts
3. **Add database** for persistent storage
4. **Set up CI/CD** for automatic deployments
5. **Add more AI models**

## 🧪 Testing Your Deployment

Use the test script I created:
```bash
python test_deployment.py https://your-project-name.railway.app
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check `requirements.txt` for missing dependencies
   - Verify Python version compatibility

2. **Port Issues:**
   - Railway uses `$PORT` environment variable
   - Ensure your app listens on `0.0.0.0`

3. **Memory Issues:**
   - AI model loading uses significant RAM
   - Consider using smaller models

4. **Timeout Issues:**
   - First request may take 30-60 seconds
   - Subsequent requests will be faster

---

**🎉 Your Email Guardian API is now live on Railway with a generous free tier!**

### Quick Commands

```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open dashboard
railway open
``` 