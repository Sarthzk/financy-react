# 🔧 Financy React - Troubleshooting Guide

## Common Issues & Solutions

---

### 🚨 Issue: "Cannot find module 'firebase'"

**Cause:** Dependencies not installed

**Solution:**
```bash
npm install firebase lucide-react chart.js react-chartjs-2 framer-motion
```

---

### 🚨 Issue: Tailwind styles not applying

**Problem 1:** Content paths incorrect in `tailwind.config.js`

**Solution:**
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Make sure this includes all files
  ],
}
```

**Problem 2:** Tailwind directives missing

**Solution:** Check `src/index.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 🚨 Issue: Charts not displaying

**Cause:** Chart.js components not registered

**Solution:** Ensure proper registration in component:
```javascript
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
```

---

### 🚨 Issue: "Firebase: Error (auth/invalid-api-key)"

**Cause:** Firebase config incorrect

**Solution:**
1. Check `src/firebase.js`
2. Verify config matches Firebase Console
3. Ensure no extra spaces or quotes

---

### 🚨 Issue: Real-time updates not working

**Cause:** Firestore listener not set up correctly

**Solution:** Check `App.jsx` has:
```javascript
useEffect(() => {
  if (!user) return;
  
  const q = query(
    collection(db, 'entries'),
    where('uid', '==', user.uid)
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // ... update state
  });
  
  return () => unsubscribe(); // Important!
}, [user]);
```

---

### 🚨 Issue: "Module not found: Error: Can't resolve './components/...'"

**Cause:** File path incorrect or component not created

**Solution:**
1. Verify component exists at specified path
2. Check file name matches import (case-sensitive)
3. Ensure `.jsx` extension is correct

---

### 🚨 Issue: Page not changing when clicking sidebar links

**Cause:** State not updating or conditional rendering broken

**Solution:** Check:
```javascript
// In App.jsx
const [currentPage, setCurrentPage] = useState('dashboard');

// In Sidebar
<Sidebar 
  currentPage={currentPage} 
  onPageChange={setCurrentPage}  // Must pass setState function
/>

// In page rendering
<div className={currentPage === 'dashboard' ? '' : 'hidden'}>
```

---

### 🚨 Issue: "user.displayName is null"

**Cause:** User signed up without providing name

**Solution:** Add fallback in ProfileView:
```javascript
const displayName = user.displayName || 'Unnamed User';
```

---

### 🚨 Issue: Sidebar not collapsing on mobile

**Cause:** Tailwind breakpoints or state management issue

**Solution:**
1. Check `lg:` prefix on classes
2. Verify state updates in Sidebar component
3. Check window resize listener

---

### 🚨 Issue: Toast notifications not showing

**Cause:** Framer Motion not installed or notification state not updating

**Solution:**
```bash
npm install framer-motion
```

And verify in App.jsx:
```javascript
const [notifications, setNotifications] = useState([]);

const showNotification = (message, type = 'info') => {
  const id = Date.now();
  setNotifications(prev => [...prev, { id, message, type }]);
};
```

---

### 🚨 Issue: "Hydration error" or "Text content mismatch"

**Cause:** Server-side rendering mismatch (if deploying to SSR platform)

**Solution:** This project is CSR-only. If using Next.js or similar:
1. Add `'use client'` directive
2. Or convert to pure CSR deployment

---

### 🚨 Issue: CSV export not working

**Cause:** No data or browser blocking download

**Solution:**
1. Check entries array has data
2. Verify browser allows downloads
3. Check console for errors

---

### 🚨 Issue: Google Sign-In popup blocked

**Cause:** Browser popup blocker

**Solution:**
1. Allow popups for localhost
2. Use redirect method instead:
```javascript
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
```

---

### 🚨 Issue: Styles look different in production

**Cause:** Tailwind purging needed classes

**Solution:**
1. Check `tailwind.config.js` content paths
2. Avoid dynamic class names like:
```javascript
// Bad
className={`text-${color}-500`}

// Good
className={color === 'red' ? 'text-red-500' : 'text-blue-500'}
```

---

### 🚨 Issue: "Failed to fetch" when calling Firebase

**Cause:** CORS or network configuration

**Solution:**
1. Check Firebase project settings
2. Verify authorized domains in Firebase Console
3. Check browser network tab for specific error

---

### 🚨 Issue: App crashes on page refresh

**Cause:** Trying to access data before it's loaded

**Solution:** Add loading states:
```javascript
if (loading) return <div>Loading...</div>;
if (!user) return <AuthOverlay />;
// ... rest of app
```

---

### 🚨 Issue: Icons not displaying (Lucide)

**Cause:** Wrong import or package not installed

**Solution:**
```bash
npm install lucide-react
```

Import correctly:
```javascript
import { LogOut, Trash2, Download } from 'lucide-react';

<LogOut size={20} />
```

---

### 🚨 Issue: Transaction form not submitting

**Cause:** Missing preventDefault or Firebase error

**Solution:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();  // Important!
  
  if (!amount || !category) {
    onError('Please fill all fields');
    return;
  }
  
  // ... rest of logic
};
```

---

### 🚨 Issue: Balance showing wrong value

**Cause:** Calculation logic error

**Solution:** Verify in App.jsx:
```javascript
const totalIncome = entries
  .filter(e => e.type === 'income')
  .reduce((sum, e) => sum + e.amount, 0);

const totalExpenses = entries
  .filter(e => e.type === 'expense')
  .reduce((sum, e) => sum + e.amount, 0);

const balance = totalIncome - totalExpenses;
```

---

## 🔍 Debugging Tools

### React DevTools
Install browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Check Component State
```javascript
// Add to any component
console.log('Component State:', { state1, state2, ... });
```

### Check Props
```javascript
function MyComponent(props) {
  console.log('Received props:', props);
  // ...
}
```

### Firebase Debugging
```javascript
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .then(() => console.log('Persistence enabled'))
  .catch(err => console.error('Persistence error:', err));
```

---

## 📞 Getting Help

### Check these first:
1. ✅ Browser console for errors
2. ✅ Network tab for failed requests
3. ✅ React DevTools for component state
4. ✅ Firebase Console for Firestore rules

### Common error locations:
- `src/App.jsx` - Main logic and state
- `src/firebase.js` - Configuration
- `src/components/` - Individual features
- `tailwind.config.js` - Styling issues

### Reset everything:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Start fresh
npm run dev
```

---

## ✅ Health Check Script

Run this in browser console to check everything:

```javascript
// Check Firebase
console.log('Firebase Auth:', typeof firebase !== 'undefined');
console.log('Current User:', auth.currentUser);

// Check React
console.log('React Version:', React.version);

// Check State
console.log('Entries:', entries.length);
console.log('Balance:', balance);

// Check UI
console.log('Current Page:', currentPage);
console.log('Notifications:', notifications.length);
```

---

## 🆘 Still Having Issues?

1. **Double-check all file locations** against PROJECT_STRUCTURE.md
2. **Verify all dependencies installed** via `npm list`
3. **Check Firebase Console** for auth/database errors
4. **Review browser console** for specific error messages
5. **Compare your code** with provided files character-by-character

Most issues are caused by:
- Missing dependencies
- Incorrect file paths
- Typos in Firebase config
- Missing return statements in useEffect
- Incorrect Tailwind class names

---

**Good luck! You've got this! 🚀**
