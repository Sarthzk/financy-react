# 🎨 Theme System Quick Start Guide

## Overview

Financy now features a complete light/dark theme system with:
- 🌞 Professional light mode
- 🌙 Professional dark mode  
- 💾 Automatic preference saving
- 🎯 System preference detection
- ⚡ Smooth transitions

---

## Using the Theme Toggle

1. **In the Sidebar**, look for the theme toggle button (Sun ☀️ or Moon 🌙 icon)
2. **Click it** to switch between light and dark mode
3. Your preference is **automatically saved**
4. The theme **persists across sessions**

---

## For Developers

### Import and Use the Theme Hook

```javascript
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

### Styling with Tailwind Dark Mode

**Method 1: Inline dark classes**
```jsx
<div className="bg-white dark:bg-slate-900">
  Content
</div>
```

**Method 2: Using Tailwind utilities**
```jsx
<div className="
  bg-white dark:bg-slate-900
  text-gray-900 dark:text-white
  border border-gray-200 dark:border-slate-700
  shadow-sm dark:shadow-lg
">
  Card content
</div>
```

**Method 3: CSS custom properties (if needed)**
```css
.my-element {
  background-color: var(--bg-light);
}

.dark .my-element {
  background-color: var(--bg-dark);
}
```

---

## Color System

### Light Mode Colors
- **Background:** `bg-white`
- **Secondary:** `bg-gray-50`, `bg-gray-100`
- **Text:** `text-gray-900`, `text-gray-600`
- **Borders:** `border-gray-200`
- **Cards:** `bg-white` with `shadow-sm`

### Dark Mode Colors (prepend with `dark:`)
- **Background:** `dark:bg-slate-950`
- **Secondary:** `dark:bg-slate-900`, `dark:bg-slate-800`
- **Text:** `dark:text-white`, `dark:text-gray-400`
- **Borders:** `dark:border-slate-700`
- **Cards:** `dark:bg-slate-800` with `dark:shadow-lg`

### Brand Colors (Consistent)
- **Primary Blue:** `text-primary` → `#0B50DA`
- **Gold Accent:** `text-gold` → `#D4AF37`
- **Success:** `text-green-500`
- **Error:** `text-red-500`
- **Warning:** `text-yellow-500`

---

## Component Examples

### Card Component (Light & Dark)
```jsx
<div className="
  bg-white dark:bg-slate-800
  border border-gray-200 dark:border-slate-700
  rounded-2xl p-8
  shadow-sm dark:shadow-lg
">
  <h2 className="text-gray-900 dark:text-white font-bold">
    Title
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Description
  </p>
</div>
```

### Button Component (Light & Dark)
```jsx
<button className="
  bg-primary hover:bg-blue-700
  text-white
  px-4 py-2 rounded-lg
  transition-colors
">
  Click me
</button>
```

### Input Component (Light & Dark)
```jsx
<input
  className="
    bg-white dark:bg-slate-700
    text-gray-900 dark:text-white
    border border-gray-200 dark:border-slate-600
    rounded-lg p-3
    focus:border-primary
    transition-colors
  "
  placeholder="Enter text..."
/>
```

---

## File Structure

```
src/
├── context/
│   └── ThemeContext.jsx        ← Theme provider & hook
├── components/
│   ├── Sidebar.jsx             ← Has theme toggle button
│   ├── DashboardView.jsx       ← Uses theme colors
│   ├── ProfileView.jsx         ← Theme-aware
│   ├── TransactionForm.jsx     ← Light/dark inputs
│   ├── TransactionTable.jsx    ← Themed rows
│   ├── HistoryView.jsx         ← Themed chart
│   ├── Toast.jsx               ← Theme notifications
│   └── ...
├── main.jsx                    ← Wrapped with ThemeProvider
├── index.css                   ← Theme styles
└── App.jsx                     ← Uses ThemeProvider

tailwind.config.js              ← Dark mode config
```

---

## Best Practices

### ✅ DO
- Always use `dark:` prefix for dark mode styles
- Test components in both light and dark modes
- Use semantic color names (`text-gray-600` not `text-gray` with hex)
- Provide sufficient contrast (WCAG AA standard)
- Use `transition-colors` for smooth theme switching
- Keep dark mode styles in the same class string

### ❌ DON'T
- Don't hardcode colors (use Tailwind classes)
- Don't forget dark mode variants
- Don't create separate stylesheets
- Don't mix themes in single components
- Don't use colors that work only in one theme

---

## Troubleshooting

### Theme not switching?
1. Check if `ThemeProvider` wraps the app in `main.jsx`
2. Verify `useTheme()` is imported correctly
3. Check browser console for errors

### Dark mode not applying?
1. Ensure Tailwind config has `darkMode: 'class'`
2. Check that `dark:` classes are in Tailwind content
3. Verify HTML element has `dark` class applied

### Colors look wrong?
1. Check contrast ratio (should be ≥ 4.5:1)
2. Use Tailwind's color scale consistently
3. Test with color blindness simulator

---

## Theme Priority

The app determines theme in this order:
1. **User preference** (in LocalStorage)
2. **System preference** (OS dark mode setting)
3. **Default** (dark mode)

---

## Performance Impact

- ✅ **0 extra re-renders** on theme toggle
- ✅ **CSS-only transitions** (no JavaScript animations)
- ✅ **200ms transition time** (smooth, not jarring)
- ✅ **No bundle size bloat** (pure CSS approach)
- ✅ **LocalStorage only** (minimal persistence overhead)

---

## Future Customization

To add more themes, modify `src/context/ThemeContext.jsx`:

```javascript
// Add new theme to context
const THEMES = {
  light: 'light',
  dark: 'dark',
  highContrast: 'high-contrast',  // Example
};
```

And update Tailwind config to support it.

---

## Questions?

Refer to:
- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [React Context Docs](https://react.dev/reference/react/useContext)
- Project files in `src/context/` and `src/components/`

Happy theming! 🎨
