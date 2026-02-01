# 📋 Financy React - Quick Reference

## 🎯 File Locations Checklist

Use this checklist to ensure all files are in the correct location:

### Root Directory (financy-react/)
```
□ index.html
□ package.json
□ vite.config.js
□ tailwind.config.js
□ postcss.config.js
□ README.md
□ SETUP_GUIDE.md
□ MIGRATION_NOTES.md
□ PROJECT_STRUCTURE.md
```

### src/ Directory
```
□ src/App.jsx
□ src/main.jsx
□ src/index.css
□ src/firebase.js
```

### src/components/
```
□ src/components/AuthOverlay.jsx
□ src/components/DashboardView.jsx
□ src/components/HistoryView.jsx
□ src/components/ProfileView.jsx
□ src/components/Sidebar.jsx
□ src/components/StatsCard.jsx
□ src/components/Toast.jsx
□ src/components/TransactionForm.jsx
□ src/components/TransactionTable.jsx
```

### src/hooks/
```
□ src/hooks/useAuth.js
```

### src/utils/
```
□ src/utils/helpers.js
```

---

## ⚡ Quick Setup Commands

```bash
# 1. Create project
npm create vite@latest financy-react -- --template react
cd financy-react

# 2. Install all dependencies at once
npm install firebase lucide-react chart.js react-chartjs-2 framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Copy all provided files (see checklist above)

# 4. Start development server
npm run dev
```

---

## 🔧 Component Props Reference

### StatsCard
```jsx
<StatsCard
  title="string"              // e.g., "Available Balance"
  value={number}              // e.g., 5000
  percentage={number}         // Optional, e.g., 60
  type="balance|income|expense"
/>
```

### TransactionTable
```jsx
<TransactionTable
  transactions={array}        // Array of transaction objects
  onDelete={function}         // Delete handler
  limit={number}              // Optional, limits displayed items
/>
```

### TransactionForm
```jsx
<TransactionForm
  onSuccess={function}        // Success callback
  onError={function}          // Error callback
/>
```

### DashboardView
```jsx
<DashboardView
  entries={array}
  totalIncome={number}
  totalExpenses={number}
  balance={number}
  onDeleteEntry={function}
  onNotification={function}
/>
```

### HistoryView
```jsx
<HistoryView
  entries={array}
  onDeleteEntry={function}
/>
```

### Sidebar
```jsx
<Sidebar
  currentPage="dashboard|history|profile"
  onPageChange={function}
/>
```

---

## 🎨 Available Tailwind Colors

```jsx
bg-midnight     // #070b14 - Main background
bg-primary      // #0B50DA - Primary blue
bg-gold         // #D4AF37 - Gold accent
bg-dark         // #0D141C - Dark elements
bg-card         // #111928 - Card background
border-border   // #242F3A - Border color
```

---

## 🔥 Firebase Structure

### Collections
```
users/
  {uid}/
    displayName: string

entries/
  {entryId}/
    uid: string
    type: "income" | "expense"
    amount: number
    category: string
    date: string (YYYY-MM-DD)
    createdAt: timestamp
```

---

## 📊 Data Flow Diagram

```
User Action (UI)
      ↓
Event Handler
      ↓
Firebase Operation
      ↓
onSnapshot Listener
      ↓
State Update (setEntries)
      ↓
Component Re-render
      ↓
UI Update
```

---

## 🛠 Common Tasks

### Add a new page
1. Create component in `src/components/`
2. Import in `App.jsx`
3. Add to navigation in `Sidebar.jsx`
4. Add conditional render in `App.jsx`

### Add a new stat card
```jsx
<StatsCard
  title="Your Stat"
  value={calculatedValue}
  type="custom"
/>
```

### Modify colors
Edit `tailwind.config.js`:
```javascript
extend: {
  colors: {
    yourColor: '#hexcode'
  }
}
```

### Add authentication provider
Edit `src/firebase.js`:
```javascript
export const facebookProvider = new FacebookAuthProvider();
```

---

## 📱 Responsive Breakpoints

```javascript
sm:  640px   // Small devices
md:  768px   // Medium devices
lg:  1024px  // Large devices (sidebar breakpoint)
xl:  1280px  // Extra large
2xl: 1536px  // 2X Extra large
```

---

## 🐛 Debugging Tips

### Check auth state
```javascript
console.log('User:', user);
console.log('Loading:', loading);
```

### Check entries data
```javascript
console.log('Entries:', entries);
console.log('Total Income:', totalIncome);
console.log('Total Expenses:', totalExpenses);
```

### Check Firebase connection
```javascript
import { getFirestore } from 'firebase/firestore';
console.log('Firestore instance:', getFirestore());
```

---

## 🚀 Build & Deploy

### Build for production
```bash
npm run build
```
Output: `dist/` folder

### Preview production build
```bash
npm run preview
```

### Deploy options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Firebase Hosting**: `firebase deploy`

---

## 📚 Import Paths Reference

```javascript
// Components
import Component from './components/Component'

// Hooks
import { useAuth } from './hooks/useAuth'

// Utils
import { formatCurrency } from './utils/helpers'

// Firebase
import { auth, db } from './firebase'

// Firebase functions
import { collection, addDoc } from 'firebase/firestore'
```

---

## ✅ Verification Checklist

Before running the app:

□ All files in correct locations
□ `package.json` has all dependencies
□ Firebase config matches your project
□ Tailwind config includes all paths
□ No TypeScript errors (if using TS)
□ All imports are correct
□ `npm install` completed successfully

---

## 🎉 Success Indicators

When running `npm run dev`, you should see:

✅ No console errors
✅ Login screen appears
✅ Can authenticate with email/Google
✅ Dashboard loads with stats
✅ Can add transactions
✅ Charts display correctly
✅ Mobile menu works
✅ Sidebar collapse works
✅ All pages navigate correctly

---

**Need help? Check:**
- README.md - Complete overview
- MIGRATION_NOTES.md - Technical details
- PROJECT_STRUCTURE.md - File organization
- SETUP_GUIDE.md - Step-by-step setup
