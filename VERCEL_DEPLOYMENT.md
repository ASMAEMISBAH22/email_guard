# 🚀 Vercel Deployment Guide (Free Tier - No Credit Card Required)

## Deploy Email Guardian Backend to Vercel

### Prerequisites
- GitHub account with your Email Guardian repository
- Vercel account (free at [vercel.com](https://vercel.com))

### Step 1: Create Vercel Account

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up with GitHub** (no credit card required)
3. **Verify your email**

### Step 2: Import Your Project

1. **Click "New Project"**
2. **Choose "Import Git Repository"**
3. **Select your repository:** `ASMAEMISBAH22/email_guard`
4. **Click "Import"**

### Step 3: Configure Project Settings

Vercel will automatically detect your Python project. Configure:

#### **Framework Preset:**
- **Select:** "Other"

#### **Root Directory:**
- **Leave as:** `./` (default)

#### **Build Command:**
- **Enter:** `pip install -r requirements.txt`

#### **Output Directory:**
- **Leave as:** `./` (default)

#### **Install Command:**
- **Enter:** `pip install -r requirements.txt`

### Step 4: Environment Variables (Optional)

Add these in Vercel dashboard → Settings → Environment Variables:

```bash
PYTHON_VERSION=3.11
ENVIRONMENT=production
LOG_LEVEL=info
```

### Step 5: Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (2-5 minutes)
3. **Your API will be live!**

### Step 6: Get Your API URL

Your API will be available at:
```
https://your-project-name.vercel.app
```

### Step 7: Test Your Deployment

#### Test Endpoints:
```bash
# Health check
curl https://your-project-name.vercel.app/health

# Create API key
curl -X POST "https://your-project-name.vercel.app/create-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test App"}'

# Scan email (replace YOUR_API_KEY)
curl -X POST "https://your-project-name.vercel.app/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'

# Get history
curl "https://your-project-name.vercel.app/history?limit=10"
```

## 🔧 Vercel Features

### 1. Serverless Functions
- **Automatic scaling** based on demand
- **Cold start optimization** for better performance
- **Edge functions** for global distribution

### 2. Automatic Deployments
- **GitHub integration** - Deploy on every push
- **Preview deployments** - Test changes before production
- **Rollback** - Easy version management

### 3. Global CDN
- **Edge network** - Fast worldwide access
- **Automatic HTTPS** - Secure by default
- **Custom domains** - Use your own domain

### 4. Monitoring & Analytics
- **Real-time analytics** - Track usage and performance
- **Function logs** - Debug your serverless functions
- **Performance monitoring** - Optimize your app

## 💰 Vercel Free Tier

### Serverless Functions
- **100GB-hours/month** (generous for development)
- **10-second timeout** (sufficient for email scanning)
- **Unlimited invocations**

### Bandwidth
- **100GB/month** - Plenty for API usage
- **Global CDN** - Fast worldwide access

### Custom Domains
- **Unlimited custom domains**
- **Free SSL certificates**
- **Automatic HTTPS**

## 🎯 Advantages of Vercel

✅ **No credit card required**  
✅ **Generous free tier**  
✅ **Automatic deployments**  
✅ **Global CDN**  
✅ **Custom domains**  
✅ **Real-time analytics**  
✅ **Easy scaling**  

## 🔒 Security Features

- **Automatic HTTPS** with custom domains
- **Environment variables** for sensitive data
- **Git-based deployments** with version control
- **Isolated environments** for each deployment

## 🚀 Performance Features

- **Edge functions** for global distribution
- **Automatic scaling** based on traffic
- **Cold start optimization** for better performance
- **Global CDN** for fast access

## 📊 Monitoring

- **Real-time analytics** in Vercel dashboard
- **Function logs** for debugging
- **Performance monitoring** and optimization
- **Custom metrics** and alerts

## 🔧 Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy locally
vercel

# View logs
vercel logs
```

## 📈 Scaling

When you exceed free tier:
- **Pay-as-you-go** pricing
- **Automatic scaling** based on usage
- **No upfront costs** or commitments

## 🎉 Next Steps

1. **Set up custom domain** (optional)
2. **Configure monitoring** and alerts
3. **Add more AI models**
4. **Set up CI/CD** for automatic deployments
5. **Optimize performance** with edge functions

## 🧪 Testing Your Deployment

Use the test script I created:
```bash
python test_deployment.py https://your-project-name.vercel.app
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check `requirements.txt` for missing dependencies
   - Verify Python version compatibility

2. **Function Timeouts:**
   - AI model loading may take time
   - Consider using smaller models

3. **Cold Starts:**
   - First request may take 10-30 seconds
   - Subsequent requests will be faster

4. **Memory Issues:**
   - Vercel functions have memory limits
   - Consider optimizing model loading

---

**🎉 Your Email Guardian API is now live on Vercel with a generous free tier!**

### Quick Commands

```bash
# Deploy to Vercel
vercel

# View logs
vercel logs

# Open dashboard
vercel open
``` 