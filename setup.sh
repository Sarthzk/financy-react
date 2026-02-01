#!/bin/bash

# Financy React - Automated Setup Script
# This script will set up the complete React project

echo "🚀 Financy React - Automated Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Step 1: Create Vite project
echo "📦 Step 1: Creating Vite project..."
npm create vite@latest financy-react -- --template react

# Step 2: Navigate to project
cd financy-react || exit

# Step 3: Install dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm install

# Step 4: Install additional packages
echo ""
echo "📦 Step 3: Installing Financy packages..."
npm install firebase lucide-react chart.js react-chartjs-2 framer-motion

# Step 5: Install Tailwind
echo ""
echo "📦 Step 4: Installing Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy all files from the financy-react folder to your project"
echo "2. Replace default files with provided files"
echo "3. Run: npm run dev"
echo ""
echo "🎉 Happy coding!"
