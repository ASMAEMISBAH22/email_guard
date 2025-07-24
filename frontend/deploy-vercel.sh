#!/bin/bash

# Email Guardian Frontend - Vercel Deployment Script
# This script helps deploy the React frontend to Vercel

echo "🚀 Email Guardian Frontend - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the frontend directory
if [ ! -f "package.json" ] || [ ! -f "src/App.js" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    echo "   cd frontend && ./deploy-vercel.sh"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "📋 Deployment Information:"
echo "   - Backend URL: https://05d64819-55b5-413a-a230-392814dd1908-00-3a3sjoj9agigo.spock.replit.dev"
echo "   - Environment Variable: REACT_APP_API_URL is set in vercel.json"
echo ""

vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test your deployed frontend"
echo "   2. Try the 'Demo Analysis' feature (no API key required)"
echo "   3. Generate an API key and test protected features"
echo "   4. Check that scan history works correctly"
echo ""
echo "🔗 Your frontend should now be accessible at your Vercel URL" 