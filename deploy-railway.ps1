# Quick Deployment Script for Railway (Windows PowerShell)

Write-Host "🚀 Deploying AQI System to Railway..." -ForegroundColor Green
Write-Host ""

# Check if Railway CLI is installed
$railwayExists = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayExists) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "📝 Logging in to Railway..." -ForegroundColor Cyan
railway login

# Initialize project if needed
if (-not (Test-Path "railway.json")) {
    Write-Host "⚙️ Initializing Railway project..." -ForegroundColor Yellow
    railway init
}

# Deploy backend
Write-Host ""
Write-Host "🔧 Deploying Backend..." -ForegroundColor Cyan
Set-Location backend
railway up
$BACKEND_URL = railway domain
Set-Location ..

Write-Host ""
Write-Host "✅ Backend deployed at: $BACKEND_URL" -ForegroundColor Green
Write-Host ""

# Deploy frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Cyan
Write-Host "⚠️ Make sure to set VITE_API_BASE_URL=$BACKEND_URL in Railway dashboard" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter when you've set the environment variable"

Set-Location frontend
railway up
$FRONTEND_URL = railway domain
Set-Location ..

Write-Host ""
Write-Host "✅ Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend ALLOWED_ORIGINS to include: $FRONTEND_URL"
Write-Host "2. Test your application at: $FRONTEND_URL"
Write-Host "3. Test WebSocket connection at: wss://$($BACKEND_URL -replace 'https://','')/ws"
Write-Host ""
