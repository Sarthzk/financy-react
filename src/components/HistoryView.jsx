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
        label: 'Spending',
        data: dates.map(date => dailySpending[date]),
        borderColor: '#0B50DA',
        backgroundColor: 'rgba(11, 80, 218, 0.1)',
        tension: 0.4,
        fill: true
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
          color: '#94a3b8'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Daily Spending Trend Chart */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <h3 className="font-bold text-xl mb-6 text-white text-center">
          Daily Spending Trend
        </h3>
        {dates.length > 0 ? (
          <div className="h-[300px] relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-medium">
            No spending data available
          </div>
        )}
      </div>

      {/* All Transactions */}
      <div className="glass-card p-8 rounded-[2.5rem]">
        <h3 className="font-bold text-xl mb-6 text-white">All Transactions</h3>
        <TransactionTable transactions={entries} onDelete={onDeleteEntry} />
      </div>
    </div>
  );
}
