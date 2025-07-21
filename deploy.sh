#!/bin/bash

# Email Guardian Render Deployment Script
echo "🚀 Email Guardian Render Deployment Helper"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "backend/app.py"
    "ai/email_guard.py"
    "requirements.txt"
    "Procfile"
    "runtime.txt"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files found!"

# Check git status
echo "📊 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for Render deployment'"
    echo "   git push"
else
    echo "✅ All changes committed"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Go to https://render.com and sign up/login"
echo "2. Click 'New +' → 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Render will auto-detect render.yaml"
echo "5. Click 'Apply' to deploy"
echo ""
echo "📝 Your API will be available at:"
echo "   https://your-app-name.onrender.com"
echo ""
echo "🔑 After deployment, create an API key:"
echo "   curl -X POST 'https://your-app-name.onrender.com/create-key' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"name\": \"My App\"}'"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md" 