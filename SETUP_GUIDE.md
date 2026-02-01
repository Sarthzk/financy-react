# Financy - React Migration Setup Guide

## Step 1: Initialize Vite Project

```bash
npm create vite@latest financy-react -- --template react
cd financy-react
```

## Step 2: Install Dependencies

```bash
# Core dependencies
npm install firebase lucide-react chart.js react-chartjs-2 framer-motion

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Step 3: Project Structure

```
financy-react/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── AuthOverlay.jsx
│   │   ├── DashboardView.jsx
│   │   ├── HistoryView.jsx
│   │   └── ProfileView.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── utils/
│   │   └── helpers.js
│   ├── firebase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── package.json
└── vite.config.js
```

## Step 4: Development

```bash
npm run dev
```

## Step 5: Build for Production

```bash
npm run build
npm run preview
```

---

**All configuration files and components are provided in the following files.**
