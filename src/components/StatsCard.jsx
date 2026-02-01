import { formatCurrency } from '../utils/helpers';


export default function StatsCard({ title, value, percentage, type = 'balance' }) {
  const isBalance = type === 'balance';
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  
  const isNegativeBalance = isBalance && value < 0;
  
  return (
    <div
      className={`
        p-8 rounded-[2.5rem] shadow-xl transition-colors duration-300
        ${isBalance 
          ? isNegativeBalance 
            ? 'bg-red-600' 
            : 'bg-primary'
          : 'glass-card'
        }
      `}
    >
      <p
        className={`
          text-sm mb-1 font-bold tracking-wide uppercase
          ${isBalance ? 'text-blue-100' : 'text-slate-500'}
        `}
      >
        {title}
      </p>
      
      <div className="flex items-baseline gap-2">
        <h2
          className={`
            stat-number font-bold tracking-tight
            ${isBalance ? 'text-4xl text-white' : 'text-2xl'}
            ${isIncome && 'text-green-500'}
            ${isExpense && 'text-red-500'}
          `}
        >
          {formatCurrency(value)}
        </h2>
        
        {percentage !== undefined && !isBalance && (
          <span
            className={`
              text-xs font-bold px-2 py-0.5 rounded-full
              ${isIncome && 'text-green-500/80 bg-green-500/10'}
              ${isExpense && 'text-red-500/80 bg-red-500/10'}
            `}
          >
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
