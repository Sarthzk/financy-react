import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function MonthlyTrends({ entries }) {
  const { monthlyData, chartData, monthlyStats } = useMemo(() => {
    const monthlyBreakdown = {};

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { income: 0, expenses: 0, transactions: 0 };
      }

      if (entry.type === 'income') {
        monthlyBreakdown[monthKey].income += entry.amount;
      } else {
        monthlyBreakdown[monthKey].expenses += entry.amount;
      }
      monthlyBreakdown[monthKey].transactions += 1;
    });

    const months = Object.keys(monthlyBreakdown).sort();
    const incomeData = months.map(m => monthlyBreakdown[m].income);
    const expenseData = months.map(m => monthlyBreakdown[m].expenses);
    const netData = months.map((m, i) => incomeData[i] - expenseData[i]);

    const chartData = {
      labels: months.map(m => {
        const [year, month] = m.split('-');
        return new Date(year, parseInt(month) - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      }),
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Net (Income - Expenses)',
          data: netData,
          borderColor: '#0B50DA',
          backgroundColor: 'rgba(11, 80, 218, 0.05)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: '#0B50DA',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };

    const stats = months.map((m, idx) => ({
      month: m,
      displayMonth: chartData.labels[idx],
      income: incomeData[idx],
      expenses: expenseData[idx],
      net: netData[idx],
      transactions: monthlyBreakdown[m].transactions,
      savingsRate: incomeData[idx] > 0 ? Math.round((netData[idx] / incomeData[idx]) * 100) : 0
    }));

    return {
      monthlyData: monthlyBreakdown,
      chartData,
      monthlyStats: stats
    };
  }, [entries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6B7280',
          font: { size: 12, weight: 500 },
          padding: 16,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: { color: '#6B7280' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280' }
      }
    }
  };

  const totalIncome = monthlyStats.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyStats.reduce((sum, m) => sum + m.expenses, 0);
  const avgMonthlyIncome = monthlyStats.length > 0 ? totalIncome / monthlyStats.length : 0;
  const avgMonthlyExpense = monthlyStats.length > 0 ? totalExpenses / monthlyStats.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Monthly Trends</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your income and expenses over time</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Avg Monthly Income</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgMonthlyIncome)}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingUp size={16} className="text-red-600 rotate-180" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Avg Monthly Expenses</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(avgMonthlyExpense)}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total Months</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{monthlyStats.length}</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total Transactions</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{entries.length}</p>
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Income vs Expenses Trend</h3>
        <div className="h-96">
          {monthlyStats.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Monthly Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Month</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Income</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Expenses</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Net</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Savings Rate</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.length > 0 ? (
                monthlyStats.slice().reverse().map((stat, idx) => (
                  <tr 
                    key={idx}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{stat.displayMonth}</td>
                    <td className="px-6 py-4 text-right text-sm text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(stat.income)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                      {formatCurrency(stat.expenses)}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-medium ${stat.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(stat.net)}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-medium ${stat.savingsRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.savingsRate}%
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">{stat.transactions}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
