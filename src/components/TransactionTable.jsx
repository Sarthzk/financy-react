import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getDisplayCategory, sanitizeInput } from '../utils/helpers';

export default function TransactionTable({ transactions, onDelete, limit = null }) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">📭 No transactions found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayTransactions.map((entry) => (
        <div 
          key={entry.id} 
          className="group flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl border border-gray-150 dark:border-slate-600/50 hover:bg-gray-100 dark:hover:bg-slate-700/60 hover:border-gray-200 dark:hover:border-slate-500 transition-all duration-200 hover:shadow-sm"
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              entry.type === 'income' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {entry.type === 'income' ? (
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {sanitizeInput(getDisplayCategory(entry.category))}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(entry.date).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                {entry.description && ` • ${sanitizeInput(entry.description)}`}
              </p>
            </div>
          </div>
          
          {/* Amount & Delete */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:ml-auto">
            <p
              className={`font-bold text-sm whitespace-nowrap ${
                entry.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {entry.type === 'income' ? '+' : '-'}
              {formatCurrency(entry.amount)}
            </p>
            
            <button
              onClick={() => {
                if (window.confirm('Delete this transaction?')) {
                  onDelete(entry.id);
                }
              }}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all p-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Delete transaction"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
