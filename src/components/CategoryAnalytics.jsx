import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { FINTECH_PALETTE, formatCurrency, getDisplayCategory, normalizeCategoryKey } from '../utils/helpers';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CategoryAnalytics({ entries }) {
  const { categoryData, totalByCategory, chartDataPie, chartDataBar, topCategory, topExpenseAmount, categoryTrends } = useMemo(() => {
    const categoryBreakdown = {};
    const categoryCount = {};
    const categoryDisplayNames = {};

    // Separate income and expenses by category (using normalized keys)
    const incomeCategories = {};
    const expenseCategories = {};

    entries.forEach(entry => {
      const catDisplay = entry.category || 'Uncategorized';
      const category = normalizeCategoryKey(catDisplay);
      categoryDisplayNames[category] = getDisplayCategory(catDisplay);
      
      if (entry.type === 'income') {
        incomeCategories[category] = (incomeCategories[category] || 0) + entry.amount;
      } else {
        expenseCategories[category] = (expenseCategories[category] || 0) + entry.amount;
      }
      
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + entry.amount;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Combine for total
    const totalByCategory = { ...incomeCategories, ...expenseCategories };
    
    // Sort by total for bar chart
    const labels = Object.keys(totalByCategory).sort((a, b) => totalByCategory[b] - totalByCategory[a]);
    
    // Get top EXPENSE category (sorted by expenses only)
    const expenseLabels = Object.keys(expenseCategories).sort((a, b) => expenseCategories[b] - expenseCategories[a]);
    const topExpenseCat = expenseLabels[0] || null;
    const topCat = topExpenseCat ? categoryDisplayNames[topExpenseCat] : 'N/A';
    const topExpenseAmount = topExpenseCat ? expenseCategories[topExpenseCat] : 0;
    
    // Pie chart data (expenses only for clarity)
    const pieData = {
      labels: expenseLabels.map(cat => categoryDisplayNames[cat]),
      datasets: [
        {
          data: expenseLabels.map(cat => expenseCategories[cat]),
          backgroundColor: expenseLabels.map((_, i) => FINTECH_PALETTE[i % FINTECH_PALETTE.length]),
          borderWidth: 0
        }
      ]
    };

    // Bar chart data (all transactions)
    const barData = {
      labels: labels.map(cat => categoryDisplayNames[cat]),
      datasets: [
        {
          label: 'Income',
          data: labels.map(cat => incomeCategories[cat] || 0),
          backgroundColor: '#10B981',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Expenses',
          data: labels.map(cat => expenseCategories[cat] || 0),
          backgroundColor: '#EF4444',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };

    const trends = labels.map(cat => ({
      name: categoryDisplayNames[cat],
      income: incomeCategories[cat] || 0,
      expenses: expenseCategories[cat] || 0,
      net: (incomeCategories[cat] || 0) - (expenseCategories[cat] || 0),
      count: categoryCount[cat] || 0
    }));

    return {
      categoryData: categoryBreakdown,
      totalByCategory,
      chartDataPie: pieData,
      chartDataBar: barData,
      topCategory: topCat,
      topExpenseAmount,
      categoryTrends: trends
    };
  }, [entries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          font: { size: 12, weight: 500 },
          padding: 16,
          usePointStyle: true
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(107, 114, 128, 0.1)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">Detailed insights into your spending and income by category</p>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Expense Category</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{topCategory}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {formatCurrency(topExpenseAmount || 0)}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(categoryData).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Categories tracked</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Category</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Object.keys(categoryData).length > 0 
              ? formatCurrency(Object.values(categoryData).reduce((a, b) => a + b, 0) / Object.keys(categoryData).length)
              : '₹0'
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Average spend</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Expense Distribution</h3>
          <div className="h-72 flex items-center justify-center">
            {categoryTrends.filter(t => t.expenses > 0).length > 0 ? (
              <Pie data={chartDataPie} options={chartOptions} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Income vs Expenses</h3>
          <div className="h-72">
            {categoryTrends.length > 0 ? (
              <Bar data={chartDataBar} options={barOptions} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Category Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Category Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Income</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Expenses</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Net</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryTrends.length > 0 ? (
                categoryTrends.map((trend, idx) => (
                  <tr 
                    key={idx}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{trend.name}</td>
                    <td className="px-6 py-4 text-right text-sm text-green-600 dark:text-green-400 font-medium">
                      {trend.income > 0 ? formatCurrency(trend.income) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                      {trend.expenses > 0 ? formatCurrency(trend.expenses) : '-'}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-medium ${trend.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(trend.net)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">{trend.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
