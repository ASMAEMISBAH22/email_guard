# 🚀 Replit Deployment Guide (No Credit Card Required)

## Deploy Email Guardian Backend to Replit

### Prerequisites
- GitHub account with your Email Guardian repository
- Replit account (free at [replit.com](https://replit.com))

### Step 1: Create New Repl

1. **Go to [replit.com](https://replit.com)**
2. **Sign up/login with GitHub**
3. **Click "Create Repl"**
4. **Choose:**
   - **Template:** Python
   - **Title:** `email-guardian`
   - **Language:** Python

### Step 2: Import Your Code

#### Option A: GitHub Import (Recommended)
1. **Click "Import from GitHub"**
2. **Enter your repository URL:** `https://github.com/asmaemisbah12/email-guard`
3. **Click "Import from GitHub"**

#### Option B: Manual Upload
1. **Download your repository as ZIP**
2. **Upload files to Replit**
3. **Extract and organize files**

### Step 3: Install Dependencies

In the Replit shell, run:
```bash
pip install -r requirements.txt
```

### Step 4: Configure Replit

1. **Open `.replit` file** (should be auto-created)
2. **Verify it contains:**
   ```toml
   language = "python3"
   run = "python backend/app.py"
   entrypoint = "backend/app.py"
   ```

### Step 5: Run Your Application

1. **Click the "Run" button**
2. **Wait for dependencies to install**
3. **Your API will be available at the Replit URL**

### Step 6: Get Your Public URL

1. **Click "Webview" tab**
2. **Your API URL will be:** `https://your-repl-name.your-username.repl.co`

### Step 7: Test Your Deployment

#### Test Endpoints:
```bash
# Health check
curl https://your-repl-name.your-username.repl.co/health

# Create API key
curl -X POST "https://your-repl-name.your-username.repl.co/create-key" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test App"}'

# Scan email (replace YOUR_API_KEY)
curl -X POST "https://your-repl-name.your-username.repl.co/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Test email content"}'
```

### Step 8: Deploy Frontend (Optional)

1. **Create another Repl**
2. **Choose "HTML, CSS, JS" template**
3. **Upload your frontend files**
4. **Configure for React build**

### Advantages of Replit

✅ **No credit card required**  
✅ **Free tier available**  
✅ **Real-time collaboration**  
✅ **Built-in IDE**  
✅ **Easy debugging**  
✅ **Persistent storage**  
✅ **Custom domains available**  

### Replit Features

🔄 **Always On:** Keep your repl running 24/7  
📁 **File Storage:** Persistent file system  
🔧 **Secrets:** Store API keys securely  
🌐 **Custom Domains:** Use your own domain  
👥 **Collaboration:** Work with others in real-time  

### Environment Variables (Optional)

In Replit, go to **Tools → Secrets** and add:
- `ENVIRONMENT`: `production`
- `LOG_LEVEL`: `info`

### Performance Tips

1. **Keep Repl Running:** Use "Always On" feature
2. **Optimize Dependencies:** Only install what you need
3. **Use Secrets:** Store sensitive data securely
4. **Monitor Resources:** Check usage in dashboard

### Troubleshooting

#### Common Issues:

1. **Import Errors:**
   - Check file paths in `backend/app.py`
   - Ensure `ai/email_guard.py` exists

2. **Port Issues:**
   - Replit uses port 8080 by default
   - Update `backend/app.py` if needed

3. **Memory Issues:**
   - AI model loading uses significant RAM
   - Consider using smaller models

4. **Timeout Issues:**
   - First request may take 30-60 seconds
   - Subsequent requests will be faster

### Cost

- **Replit Free Tier**: Unlimited repls, 500MB RAM, 1GB storage
- **Replit Hacker Plan**: $7/month for more resources

### Next Steps

1. **Set up custom domain** (optional)
2. **Configure monitoring**
3. **Add more AI models**
4. **Scale with paid plan** (if needed)

---

**🎉 Your Email Guardian API is now live on Replit without any credit card!**

### Quick Start Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python backend/app.py

# Test locally
curl http://localhost:8000/health
``` 