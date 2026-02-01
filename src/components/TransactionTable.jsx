import { Trash2 } from 'lucide-react';
import { formatCurrency, getDisplayCategory } from '../utils/helpers';

export default function TransactionTable({ transactions, onDelete, limit = null }) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 font-medium">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((entry) => (
        <div key={entry.id} className="transaction-row">
          <div>
            <p className="font-bold text-white text-sm">
              {getDisplayCategory(entry.category)}
            </p>
            <p className="text-[10px] text-slate-500">{entry.date}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <p
              className={`font-bold text-sm ${
                entry.type === 'income' ? 'text-green-500' : 'text-red-500'
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
              className="text-slate-600 hover:text-red-500 transition-colors p-1"
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
