import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import StatsCard from './StatsCard';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import { RECENT_ENTRIES_LIMIT, exportToCSV, FINTECH_PALETTE } from '../utils/helpers';

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
  const totalFlow = totalIncome + totalExpenses;
  const incomePercentage = totalFlow ? Math.round((totalIncome / totalFlow) * 100) : 0;
  const expensePercentage = totalFlow ? Math.round((totalExpenses / totalFlow) * 100) : 0;

  // Calculate category breakdown and chart data (memoized to avoid recreating on every render)
  const { chartLabels, chartData } = useMemo(() => {
    const categoryData = {};
    entries.forEach(entry => {
      if (entry.type === 'expense') {
        categoryData[entry.category] = (categoryData[entry.category] || 0) + entry.amount;
      }
    });

    const labels = Object.keys(categoryData);
    const data = {
      labels,
      datasets: [
        {
          data: Object.values(categoryData),
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
          color: '#94a3b8',
          font: { size: 10 }
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
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Hi, Welcome to Financy!
        </h2>
        <p className="text-slate-400 font-medium">
          Track your finances with ease
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Available Balance"
          value={balance}
          type="balance"
        />
        <StatsCard
          title="Income"
          value={totalIncome}
          percentage={incomePercentage}
          type="income"
        />
        <StatsCard
          title="Expenses"
          value={totalExpenses}
          percentage={expensePercentage}
          type="expense"
        />
      </div>

      {/* Quick Entry & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionForm
          onSuccess={(msg) => onNotification(msg, 'success')}
          onError={(msg) => onNotification(msg, 'error')}
        />

        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col">
          <h3 className="font-bold text-xl mb-6 text-white">Recent Activity</h3>
          <div className="flex-grow">
            <TransactionTable
              transactions={entries}
              onDelete={onDeleteEntry}
              limit={RECENT_ENTRIES_LIMIT}
            />
          </div>
        </div>
      </div>

      {/* Charts & Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Breakdown Chart */}
        <div className="glass-card p-8 rounded-[2.5rem] min-h-[350px]">
          <h3 className="font-bold text-xl mb-6 text-white text-center">
            Expense Breakdown
          </h3>
          {chartLabels.length > 0 ? (
            <div className="h-[250px] relative">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-bold">
              Add expenses to see breakdown
            </div>
          )}
        </div>

        {/* Export Data */}
        <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4">
          <h3 className="font-bold text-xl text-white">Export Data</h3>
          <p className="text-slate-400 text-sm max-w-[250px]">
            Securely download all your transaction history as a CSV file for your records.
          </p>
          <button
            onClick={handleExport}
            className="w-full bg-primary hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
          >
            <Download size={24} />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};

