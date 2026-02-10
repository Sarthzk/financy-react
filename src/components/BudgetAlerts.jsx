import { useState, useMemo } from 'react';
import { AlertCircle, TrendingDown, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency, getDisplayCategory, normalizeCategoryKey } from '../utils/helpers';

// Helper to capitalize category names for display
const formatCategoryName = (category) => {
  return getDisplayCategory(category);
};

export default function BudgetAlerts({ entries, onNotification }) {
  const [budgets, setBudgets] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: '', limit: '' });

  // Get unique categories from expenses (case-insensitive deduplication with normalized names)
  const categories = useMemo(() => {
    const catMap = new Map();
    entries
      .filter(e => e.type === 'expense')
      .forEach(e => {
        const cat = e.category || 'Uncategorized';
        const catKey = normalizeCategoryKey(cat);
        if (!catMap.has(catKey)) {
          // Store normalized category name (title case)
          catMap.set(catKey, getDisplayCategory(cat));
        }
      });
    return Array.from(catMap.values()).sort();
  }, [entries]);

  // Calculate current spending per category (normalized to lowercase)
  const currentSpending = useMemo(() => {
    const spending = {};
    entries
      .filter(e => e.type === 'expense')
      .forEach(e => {
        const cat = e.category || 'Uncategorized';
        const catKey = normalizeCategoryKey(cat);
        spending[catKey] = (spending[catKey] || 0) + e.amount;
      });
    return spending;
  }, [entries]);

  // Check alerts
  const alerts = useMemo(() => {
    return Object.entries(budgets).map(([category, limit]) => {
      const spent = currentSpending[category] || 0;
      const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      const isExceeded = spent > limit;
      const isWarning = percentage >= 80 && percentage < 100;
      
      return {
        category,
        limit,
        spent,
        percentage,
        isExceeded,
        isWarning,
        remaining: Math.max(0, limit - spent)
      };
    });
  }, [budgets, currentSpending]);

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) {
      onNotification('Please fill in all fields', 'error');
      return;
    }

    const limit = parseFloat(formData.limit);
    if (limit <= 0) {
      onNotification('Budget limit must be greater than 0', 'error');
      return;
    }

    const catKey = normalizeCategoryKey(formData.category);
    setBudgets(prev => ({
      ...prev,
      [catKey]: limit
    }));

    onNotification(`Budget set for ${formData.category}`, 'success');
    setFormData({ category: '', limit: '' });
    setShowForm(false);
  };

  const handleRemoveBudget = (category) => {
    const catKey = normalizeCategoryKey(category);
    setBudgets(prev => {
      const updated = { ...prev };
      delete updated[catKey];
      return updated;
    });
    onNotification(`Budget removed for ${category}`, 'success');
  };

  const exceededAlerts = alerts.filter(a => a.isExceeded);
  const warningAlerts = alerts.filter(a => a.isWarning);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Budget Alerts</h2>
          <p className="text-gray-600 dark:text-gray-400">Set spending limits and get alerts when you're approaching or exceeding them</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Budget
        </button>
      </div>

      {/* Add Budget Form */}
      {showForm && (
        <div className="glass-card p-6 rounded-2xl">
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.toLowerCase()} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Budget Limit (₹)"
                value={formData.limit}
                onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Set Budget
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Critical Alerts (Exceeded) */}
      {exceededAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle size={20} />
            Budget Exceeded
          </h3>
          <div className="space-y-3">
            {exceededAlerts.map((alert) => (
              <div key={alert.category} className="glass-card p-4 rounded-xl border-l-4 border-red-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{alert.category}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Over budget by {formatCurrency(alert.spent - alert.limit)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBudget(alert.category)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Spent: {formatCurrency(alert.spent)}</span>
                    <span className="text-gray-600 dark:text-gray-400">Limit: {formatCurrency(alert.limit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-red-600 h-full transition-all"
                      style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold text-red-600 dark:text-red-400">{alert.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Alerts (80-99%) */}
      {warningAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
            <AlertTriangle size={20} />
            Budget Warning
          </h3>
          <div className="space-y-3">
            {warningAlerts.map((alert) => (
              <div key={alert.category} className="glass-card p-4 rounded-xl border-l-4 border-yellow-600">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{alert.category}</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(alert.remaining)} remaining
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBudget(alert.category)}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-yellow-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Spent: {formatCurrency(alert.spent)}</span>
                    <span className="text-gray-600 dark:text-gray-400">Limit: {formatCurrency(alert.limit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-600 h-full transition-all"
                      style={{ width: `${alert.percentage}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold text-yellow-600 dark:text-yellow-400">{alert.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Budgets */}
      {alerts.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Budgets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Limit</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Spent</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Remaining</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Usage</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr 
                    key={alert.category}
                    className={`border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${alert.isExceeded ? 'bg-red-50 dark:bg-red-900/10' : alert.isWarning ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{alert.category}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(alert.limit)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                      {formatCurrency(alert.spent)}
                    </td>
                    <td className={`px-6 py-4 text-right text-sm font-medium ${alert.isExceeded ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {formatCurrency(alert.remaining)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all ${alert.isExceeded ? 'bg-red-600' : alert.isWarning ? 'bg-yellow-600' : 'bg-green-600'}`}
                            style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{alert.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveBudget(alert.category)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {alerts.length === 0 && (
        <div className="glass-card p-12 rounded-2xl text-center">
          <TrendingDown size={48} className="mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No budgets set yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Create your first budget to monitor your spending in different categories
          </p>
        </div>
      )}
    </div>
  );
}
