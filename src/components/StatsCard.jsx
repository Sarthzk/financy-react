import { formatCurrency } from '../utils/helpers';

export default function StatsCard({ title, value, percentage, type = 'balance' }) {
  const isBalance = type === 'balance';
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  
  const isNegativeBalance = isBalance && value < 0;
  
  return (
    <div
      className={`
        p-8 rounded-2xl shadow-sm border transition-all
        ${isBalance 
          ? isNegativeBalance 
            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' 
            : 'bg-blue-50 dark:bg-primary/10 border-blue-200 dark:border-primary/30'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
        }
      `}
    >
      <p
        className={`
          text-xs mb-2 font-bold tracking-widest uppercase
          ${isBalance 
            ? isNegativeBalance 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
          }
        `}
      >
        {title}
      </p>
      
      <div className="flex items-baseline gap-2">
        <h2
          className={`
            font-bold text-3xl tracking-tight
            ${isBalance 
              ? isNegativeBalance 
                ? 'text-red-700 dark:text-red-400' 
                : 'text-primary'
              : isIncome 
              ? 'text-green-600 dark:text-green-500'
              : 'text-red-600 dark:text-red-500'
            }
          `}
        >
          {formatCurrency(value)}
        </h2>
        
        {percentage !== undefined && !isBalance && (
          <span
            className={`
              text-xs font-bold px-2.5 py-1 rounded-full
              ${isIncome 
                ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/10' 
                : 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
              }
            `}
          >
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
