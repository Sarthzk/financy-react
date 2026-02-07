// Chart.js imports only - no React hooks needed for this component
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
import TransactionTable from './TransactionTable';

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
  // Calculate daily spending for the line chart
  const expenses = entries.filter(e => e.type === 'expense');
  const dailySpending = {};
  
  expenses.forEach(entry => {
    dailySpending[entry.date] = (dailySpending[entry.date] || 0) + entry.amount;
  });

  const dates = Object.keys(dailySpending).sort((a, b) => new Date(a) - new Date(b));
  
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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          History
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          View all your transactions and spending trends
        </p>
      </div>

      {/* Daily Spending Trend Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors">
        <div className="mb-8">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">
            Daily Spending Trend
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track your daily expenses over time
          </p>
        </div>
        {dates.length > 0 ? (
          <div className="h-[350px] relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 font-medium">
            No spending data available
          </div>
        )}
      </div>

      {/* All Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors">
        <div className="mb-8">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">
            All Transactions
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Complete transaction history
          </p>
        </div>
        <TransactionTable transactions={entries} onDelete={onDeleteEntry} />
      </div>
    </div>
  );
}
