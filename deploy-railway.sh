#!/bin/bash
# Quick Deployment Script for Railway

echo "🚀 Deploying AQI System to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "📝 Logging in to Railway..."
railway login

# Initialize project if needed
if [ ! -f "railway.json" ]; then
    echo "⚙️ Initializing Railway project..."
    railway init
fi

# Deploy backend
echo ""
echo "🔧 Deploying Backend..."
cd backend
railway up
BACKEND_URL=$(railway domain)
cd ..

echo ""
echo "✅ Backend deployed at: $BACKEND_URL"
echo ""

# Deploy frontend
echo "🎨 Deploying Frontend..."
echo "⚠️ Make sure to set VITE_API_BASE_URL=$BACKEND_URL in Railway dashboard"
echo ""
read -p "Press enter when you've set the environment variable..."

cd frontend
railway up
FRONTEND_URL=$(railway domain)
cd ..

echo ""
echo "✅ Frontend deployed at: $FRONTEND_URL"
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend ALLOWED_ORIGINS to include: $FRONTEND_URL"
echo "2. Test your application at: $FRONTEND_URL"
echo "3. Test WebSocket connection at: wss://${BACKEND_URL#https://}/ws"
echo ""
