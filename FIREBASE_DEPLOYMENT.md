# 🚀 Firebase Deployment Guide (Free Tier - No Credit Card Required)

## Deploy Email Guardian to Firebase

### Prerequisites
- Google account
- Node.js installed locally (for Firebase CLI)
- GitHub repository with your code

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Project

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"**
3. **Name it:** `email-guardian`
4. **Enable Google Analytics** (optional)
5. **Click "Create project"**

### Step 4: Initialize Firebase in Your Project

```bash
firebase init
```

Choose:
- ✅ **Functions** - Cloud Functions
- ✅ **Firestore** - Database
- ✅ **Hosting** - Web hosting (optional)

### Step 5: Configure Functions

```bash
cd firebase/functions
npm install
```

### Step 6: Deploy to Firebase

```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only functions
firebase deploy --only firestore
firebase deploy --only hosting
```

### Step 7: Get Your API URLs

After deployment, your functions will be available at:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/scanEmail
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/getHistory
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/health
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/createApiKey
```

### Step 8: Test Your Deployment

#### Test Endpoints:
```bash
# Health check
curl https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/health

# Create API key
curl -X POST "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/createApiKey" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test App"}'

# Scan email (replace YOUR_API_KEY)
curl -X POST "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/scanEmail" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'

# Get history
curl "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/getHistory?limit=10"
```

## 🔧 Firebase Services Used

### 1. Firebase Functions (Backend)
- **Serverless functions** for email scanning
- **No server management** required
- **Auto-scaling** based on demand
- **Pay-per-use** pricing

### 2. Firestore (Database)
- **NoSQL cloud database**
- **Real-time updates**
- **Automatic scaling**
- **Offline support**

### 3. Firebase Hosting (Frontend - Optional)
- **Static web hosting**
- **Global CDN**
- **Automatic HTTPS**
- **Custom domains**

## 💰 Firebase Free Tier Limits

### Functions
- **2 million invocations/month**
- **400,000 GB-seconds/month**
- **200,000 CPU-seconds/month**

### Firestore
- **1GB storage**
- **50,000 reads/day**
- **20,000 writes/day**
- **20,000 deletes/day**

### Hosting
- **10GB storage**
- **360MB/day transfer**
- **Custom domains**

## 🎯 Advantages of Firebase

✅ **No credit card required**  
✅ **Generous free tier**  
✅ **Global infrastructure**  
✅ **Real-time database**  
✅ **Built-in security**  
✅ **Easy scaling**  
✅ **Google Cloud integration**  

## 🔒 Security Features

- **Firestore security rules** protect your data
- **API key authentication** for function access
- **CORS protection** for web requests
- **Input validation** and sanitization
- **Rate limiting** (can be added)

## 🚀 Performance Features

- **Cold start optimization** for functions
- **Database indexing** for fast queries
- **Global CDN** for hosting
- **Auto-scaling** based on traffic

## 📊 Monitoring

- **Firebase Console** for real-time monitoring
- **Function logs** for debugging
- **Usage analytics** for optimization
- **Error tracking** and alerts

## 🔧 Environment Variables

Set these in Firebase Console → Functions → Configuration:

```bash
HUGGINGFACE_API_KEY=your_huggingface_key
ENVIRONMENT=production
LOG_LEVEL=info
```

## 🧪 Local Development

```bash
# Start emulators
firebase emulators:start

# Test functions locally
curl http://localhost:5001/YOUR-PROJECT-ID/us-central1/scanEmail
```

## 📈 Scaling

When you exceed free tier:
- **Functions:** $0.40 per million invocations
- **Firestore:** $0.18 per 100,000 reads
- **Hosting:** $0.026 per GB transferred

## 🎉 Next Steps

1. **Set up custom domain** (optional)
2. **Configure monitoring** and alerts
3. **Add more AI models**
4. **Implement user authentication**
5. **Add real-time features**

---

**🎉 Your Email Guardian API is now live on Firebase with a generous free tier!**

### Quick Commands

```bash
# Deploy everything
firebase deploy

# View logs
firebase functions:log

# Test locally
firebase emulators:start
``` 