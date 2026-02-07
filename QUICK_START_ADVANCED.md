# Quick Start: Advanced Features Guide

## 🎯 Getting Started with New Features

### 1. Analytics Dashboard
**Navigation:** `Dashboard → Analytics` (or use sidebar "Analytics" link)

**What you'll see:**
- **Expense Distribution Pie Chart** - Shows where your money is going
- **Income vs Expenses Bar Chart** - Compare earnings and spending by category
- **Category Insights Cards** - Top spending categories and statistics
- **Detailed Breakdown Table** - Complete breakdown with income/expense/net per category

**How to use:**
- Hover over charts for detailed information
- Click on chart segments to get more details
- Use the breakdown table to analyze specific categories

---

### 2. Monthly Trends Analysis
**Navigation:** `Dashboard → Trends` (or use sidebar "Trends" link)

**What you'll see:**
- **3-Line Trend Chart** showing:
  - Income trend (green line)
  - Expenses trend (red line)
  - Net savings trend (blue line)
- **Monthly Breakdown Table** with:
  - Monthly income and expenses
  - Net savings amount
  - Savings rate percentage
- **Quick Statistics** - Average monthly values

**How to use:**
- Track spending patterns over months
- Identify seasonal trends
- Monitor savings rate improvement
- Plan budgets based on historical data

---

### 3. Budget Management & Alerts
**Navigation:** `Dashboard → Budget` (or use sidebar "Budget" link)

**Setting a Budget:**
1. Click "Add Budget" button
2. Select a category from the dropdown
3. Enter your budget limit (e.g., 5000)
4. Click "Set Budget"

**Understanding Alerts:**
- 🟢 **Green (0-79%)** - You're within budget
- 🟡 **Yellow (80-99%)** - Warning: Approaching limit
- 🔴 **Red (>100%)** - Alert: Budget exceeded!

**Features:**
- Set multiple budgets for different categories
- Real-time spending updates
- Remove budgets anytime
- Visual progress bars show usage

**Example Budgets:**
- Food: ₹5,000
- Entertainment: ₹2,000
- Transport: ₹1,500
- Shopping: ₹3,000

---

### 4. Bulk Import with CSV
**Navigation:** `Dashboard → Import` (or use sidebar "Import" link)

**CSV Format:**
```csv
date,type,category,amount,description
2024-01-15,expense,Food,500,Lunch at cafe
2024-01-16,expense,Transport,50,Taxi ride
2024-01-17,income,Salary,50000,Monthly salary
```

**Required Fields:**
- `date` - Format: YYYY-MM-DD
- `type` - Either "income" or "expense"
- `category` - Any category name (e.g., "Food", "Travel")
- `amount` - Positive number (₹)

**Optional Fields:**
- `description` - Notes about the transaction

**Steps to Import:**
1. Prepare your CSV file with required columns
2. Click the upload area or drag-and-drop the CSV
3. Review the preview of transactions to be imported
4. Check for any validation errors (shown in red)
5. Click "Import" to add all transactions to your account

**Tips:**
- Always review the preview before importing
- Fix any validation errors shown
- Start with a small test import
- Use consistent date and category formats

---

## 🎨 Theme Support

All new features work perfectly in:
- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes at night

Toggle theme using the Sun/Moon icon in the sidebar!

---

## 📊 Common Use Cases

### Track Monthly Savings
1. Go to **Trends** page
2. Look at the blue "Net" line
3. Monitor the "Savings Rate %" column
4. Aim to improve it month-by-month

### Identify Overspending
1. Go to **Budget** page
2. Set budgets for each category
3. Watch for yellow/red alerts
4. Adjust spending habits as needed

### Plan Better
1. Go to **Analytics** page
2. Review historical spending patterns
3. Set realistic budgets based on past data
4. Go to **Trends** to see progress

### Bulk Add Historical Data
1. Export data from another app as CSV
2. Go to **Import** page
3. Upload CSV file
4. Review and import
5. Analytics will automatically update

---

## ⚡ Pro Tips

1. **Regular Reviews** - Check Analytics weekly to spot trends
2. **Budget Reviews** - Adjust budgets monthly based on actuals
3. **Category Consistency** - Use same category names for better tracking
4. **Savings Goals** - Use Trends page to see if you're meeting goals
5. **Mobile Access** - All features work great on mobile too!

---

## 🆘 Troubleshooting

### CSV Import Shows Errors
**Solution:** Check your CSV format:
- Dates must be YYYY-MM-DD
- Type must be "income" or "expense"
- Amount must be a positive number
- No empty required fields

### Charts Not Showing Data
**Solution:** You need at least one transaction to see charts
- Add a transaction via Dashboard
- Or import a CSV file with transactions
- Charts update in real-time

### Budget Not Showing Spent Amount
**Solution:** Budget only shows expenses, not income
- Check that you have expense transactions in that category
- Use the Analytics page to verify category data

### Theme Not Changing
**Solution:** Click the Sun/Moon icon in sidebar
- Light mode shows dark icon (for switching to dark)
- Dark mode shows light icon (for switching to light)

---

## 🔐 Data Security

✅ **Your data is secure:**
- All data encrypted in transit (HTTPS)
- Stored securely in Firebase
- Only you can access your transactions
- No third-party data sharing
- Regular security updates

---

## 📱 Mobile Experience

All features work great on mobile:
- Responsive charts and tables
- Touch-friendly buttons
- Sidebar collapses on small screens
- Swipe navigation support
- Full dark mode support

---

## 💡 Next Steps

Now that you know the advanced features:

1. **Analytics** - Understand your spending patterns
2. **Budgets** - Set limits for better control
3. **Trends** - Plan for the future
4. **Import** - Bulk add historical transactions

Start with Analytics to get insights into your current spending!

---

**Need Help?** Check the Features guide or read the comprehensive documentation in `ADVANCED_FEATURES.md`

Enjoy using Financy! 🎉
