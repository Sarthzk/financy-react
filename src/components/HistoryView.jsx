// Chart.js imports only - no React hooks needed for this component
import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Calendar, Filter, BarChart3, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import TransactionTable from './TransactionTable';
import { formatCurrency } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HistoryView({ entries, onDeleteEntry }) {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Calculate daily spending for the line chart
  const expenses = entries.filter(e => e.type === 'expense');
  const dailySpending = {};
  
  expenses.forEach(entry => {
    dailySpending[entry.date] = (dailySpending[entry.date] || 0) + entry.amount;
  });

  const dates = Object.keys(dailySpending).sort((a, b) => new Date(a) - new Date(b));
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    return {
      totalTransactions: entries.length,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }, [entries]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = entries;
    
    if (filterType === 'income') {
      filtered = filtered.filter(e => e.type === 'income');
    } else if (filterType === 'expense') {
      filtered = filtered.filter(e => e.type === 'expense');
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'date-desc') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'date-asc') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'amount-high') {
      sorted.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount-low') {
      sorted.sort((a, b) => a.amount - b.amount);
    }
    
    return sorted;
  }, [entries, filterType, sortBy]);
  
  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Spending',
        data: dates.map(date => dailySpending[date]),
        borderColor: '#0B50DA',
        backgroundColor: 'rgba(11, 80, 218, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#0B50DA',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#6B7280',
          usePointStyle: true,
          padding: 16
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        border: { display: false }
      },
      y: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        border: { display: false }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="pt-8 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Transaction History
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
            Monitor your spending patterns and financial activity
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Stats Cards - Premium Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Transactions Card */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700/50 rounded-xl p-6 border border-blue-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl"></div>
            <div className="relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Transactions</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">{stats.totalTransactions}</p>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-800 dark:to-slate-700/50 rounded-xl p-6 border border-green-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl"></div>
            <div className="relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Income</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400 mt-2">{formatCurrency(stats.totalIncome)}</p>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="group relative bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-800 dark:to-slate-700/50 rounded-xl p-6 border border-red-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-xl"></div>
            <div className="relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Expenses</p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">{formatCurrency(stats.totalExpenses)}</p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`group relative bg-gradient-to-br ${stats.balance >= 0 ? 'from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-700/50' : 'from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700/50'} rounded-xl p-6 border ${stats.balance >= 0 ? 'border-emerald-200 dark:border-slate-700' : 'border-orange-200 dark:border-slate-700'} hover:shadow-lg transition-all`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stats.balance >= 0 ? 'from-emerald-500/5' : 'from-orange-500/5'} to-transparent rounded-xl`}></div>
            <div className="relative space-y-3">
              <div className={`w-10 h-10 rounded-lg ${stats.balance >= 0 ? 'bg-emerald-500/10' : 'bg-orange-500/10'} flex items-center justify-center`}>
                <Wallet size={20} className={stats.balance >= 0 ? 'text-emerald-600' : 'text-orange-600'} />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Net Balance</p>
                <p className={`text-3xl font-black mt-2 ${stats.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>{formatCurrency(stats.balance)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Spending Trend Chart */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 backdrop-blur-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Daily Spending Trend
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 font-medium">
                Monitor your daily spending patterns
              </p>
            </div>
          </div>
          {dates.length > 0 ? (
            <div className="h-[380px] relative">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No spending data available</p>
            </div>
          )}
        </div>

        {/* All Transactions Section */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 backdrop-blur-sm">
          {/* Header with filters */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Transactions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 font-medium">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {/* Premium Filters Layout */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Transactions</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-xl text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-high">Highest Amount</option>
                  <option value="amount-low">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden">
            <TransactionTable transactions={filteredTransactions} onDelete={onDeleteEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}
