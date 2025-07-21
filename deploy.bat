@echo off
echo 🚀 Email Guardian Render Deployment Helper
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    echo    git remote add origin YOUR_GITHUB_REPO_URL
    echo    git push -u origin main
    pause
    exit /b 1
)

REM Check if all required files exist
echo 📋 Checking required files...

set missing_files=0

if not exist "backend\app.py" (
    echo    - backend\app.py
    set /a missing_files+=1
)

if not exist "ai\email_guard.py" (
    echo    - ai\email_guard.py
    set /a missing_files+=1
)

if not exist "requirements.txt" (
    echo    - requirements.txt
    set /a missing_files+=1
)

if not exist "Procfile" (
    echo    - Procfile
    set /a missing_files+=1
)

if not exist "runtime.txt" (
    echo    - runtime.txt
    set /a missing_files+=1
)

if %missing_files% gtr 0 (
    echo ❌ Missing required files listed above
    pause
    exit /b 1
)

echo ✅ All required files found!

REM Check git status
echo 📊 Checking git status...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  You have uncommitted changes. Please commit them first:
    echo    git add .
    echo    git commit -m "Prepare for Render deployment"
    echo    git push
) else (
    echo ✅ All changes committed
)

echo.
echo 🎯 Next Steps:
echo ==============
echo 1. Go to https://render.com and sign up/login
echo 2. Click "New +" → "Blueprint"
echo 3. Connect your GitHub repository
echo 4. Render will auto-detect render.yaml
echo 5. Click "Apply" to deploy
echo.
echo 📝 Your API will be available at:
echo    https://your-app-name.onrender.com
echo.
echo 🔑 After deployment, create an API key:
echo    curl -X POST "https://your-app-name.onrender.com/create-key" ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"name\": \"My App\"}"
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
pause 