import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import StatsCard from './StatsCard';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import { RECENT_ENTRIES_LIMIT, exportToCSV, FINTECH_PALETTE, getDisplayCategory, normalizeCategoryKey } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardView({
  entries,
  totalIncome,
  totalExpenses,
  balance,
  onDeleteEntry,
  onNotification
}) {
  // Calculate percentages
  const incomePercentage = totalIncome || totalExpenses ? Math.round((totalIncome / (totalIncome + totalExpenses)) * 100) : 0;
  const expensePercentage = totalIncome || totalExpenses ? Math.round((totalExpenses / (totalIncome + totalExpenses)) * 100) : 0;

  // Calculate category breakdown and chart data (memoized to avoid recreating on every render)
  const { chartLabels, chartData } = useMemo(() => {
    const categoryData = {};
    const categoryDisplayNames = {};
    entries.forEach(entry => {
      if (entry.type === 'expense') {
        const catDisplay = entry.category || 'Uncategorized';
        const category = normalizeCategoryKey(catDisplay);
        categoryDisplayNames[category] = getDisplayCategory(catDisplay);
        categoryData[category] = (categoryData[category] || 0) + entry.amount;
      }
    });

    const labels = Object.keys(categoryData);
    const data = {
      labels: labels.map(cat => categoryDisplayNames[cat]),
      datasets: [
        {
          data: labels.map(cat => categoryData[cat]),
          backgroundColor: labels.map((_, i) => FINTECH_PALETTE[i % FINTECH_PALETTE.length]),
          borderWidth: 0
        }
      ]
    };
    return { chartLabels: labels, chartData: data };
  }, [entries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          font: { size: 11, weight: 500 },
          padding: 16,
          usePointStyle: true
        }
      }
    }
  };

  const handleExport = () => {
    const result = exportToCSV(entries);
    if (result.success) {
      onNotification(result.message, 'success');
    } else {
      onNotification(result.message, 'info');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Track and manage your finances in one place
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Balance" value={balance} type="balance" />
        <StatsCard title="Income" value={totalIncome} percentage={incomePercentage} type="income" />
        <StatsCard title="Expenses" value={totalExpenses} percentage={expensePercentage} type="expense" />
      </div>

      {/* Charts and Entry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Categories Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Expense Breakdown
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Category distribution
                </p>
              </div>
            </div>
            {chartLabels.length > 0 ? (
              <div className="h-[320px] relative">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-400 dark:text-gray-500">
                <p>No expense data yet</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {entries.length}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl">
                  <Wallet className="text-primary" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {entries.filter(e => {
                      const entryDate = new Date(e.date);
                      const now = new Date();
                      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-500/10 p-3 rounded-xl">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Entry Form */}
        <div>
          <TransactionForm
            onSuccess={(msg) => onNotification(msg, 'success')}
            onError={(msg) => onNotification(msg, 'error')}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Your latest {RECENT_ENTRIES_LIMIT} entries
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
        <TransactionTable
          transactions={entries}
          onDelete={onDeleteEntry}
          limit={RECENT_ENTRIES_LIMIT}
        />
      </div>
    </div>
  );
};

