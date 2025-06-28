#!/bin/bash

# Backend API Test Script
# Save this as test_backend_api.sh and run: chmod +x test_backend_api.sh && ./test_backend_api.sh

echo "🔧 LYNC Backend API Test"
echo "========================"
echo ""

# Configuration
BACKEND_URL="http://localhost:3001"
TOKEN=""  # You'll need to get this from your browser localStorage

echo "🔍 Testing Backend Connectivity..."
echo ""

# Test 1: Basic Health Check
echo "1. Testing basic connectivity..."
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -o /dev/null \
     "$BACKEND_URL/"
echo ""

# Test 2: API Health Check
echo "2. Testing API health endpoint..."
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     "$BACKEND_URL/api/test"
echo ""

# Test 3: Users endpoint without authentication
echo "3. Testing users endpoint (should return 401 Unauthorized)..."
curl -s -w "Status: %{http_code}\nTime: %{time_total}s\n" \
     -o /dev/null \
     "$BACKEND_URL/api/users"
echo ""

# Test 4: Users endpoint with authentication (if token provided)
if [ -n "$TOKEN" ]; then
    echo "4. Testing users endpoint with authentication..."
    curl -s -H "Authorization: Bearer $TOKEN" \
         -H "Content-Type: application/json" \
         -w "Status: %{http_code}\nTime: %{time_total}s\n" \
         "$BACKEND_URL/api/users"
    echo ""
else
    echo "4. Skipping authenticated test (no token provided)"
    echo "   To test with authentication:"
    echo "   - Open your browser and go to http://localhost:5173"
    echo "   - Open Developer Tools (F12)"
    echo "   - In Console, run: localStorage.getItem('token')"
    echo "   - Copy the token and add it to TOKEN variable in this script"
    echo ""
fi

echo "📊 Test Results Summary:"
echo "========================"
echo "✅ If status 200: Endpoint working"
echo "⚠️  If status 404: Endpoint missing (add to backend)"
echo "🔒 If status 401: Authentication required (expected for /api/users)"
echo "❌ If connection failed: Backend not running"
echo ""

echo "🔧 Quick Fixes:"
echo "==============="
echo "Backend not running: Start your backend server"
echo "404 errors: Copy code from BACKEND_USERS_ENDPOINTS.js to your backend"
echo "401 errors on /api/users: This is expected, get a token to test further"
echo ""

echo "💡 Get your auth token:"
echo "1. Open http://localhost:5173 in browser"
echo "2. Login as admin"
echo "3. Open Console (F12) and run: console.log(localStorage.getItem('token'))"
echo "4. Copy the token and update this script"
