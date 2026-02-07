import { Trash2 } from 'lucide-react';
import { formatCurrency, getDisplayCategory, sanitizeInput } from '../utils/helpers';

export default function TransactionTable({ transactions, onDelete, limit = null }) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayTransactions.map((entry) => (
        <div key={entry.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {sanitizeInput(getDisplayCategory(entry.category))}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.date}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <p
              className={`font-bold text-sm ${
                entry.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
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
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
