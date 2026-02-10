import { useState, useRef } from 'react';
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, getDisplayCategory } from '../utils/helpers';

export default function CSVImport({ onImport, onNotification }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const parseCSV = (content) => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have header and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredFields = ['date', 'type', 'category', 'amount'];
    const missingFields = requiredFields.filter(f => !headers.includes(f));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const data = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = line.split(',').map(v => v.trim());
        const row = {};

        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        // Validate required fields
        if (!row.date || !row.type || !row.category || !row.amount) {
          errors.push(`Row ${i + 1}: Missing required field`);
          continue;
        }

        // Validate date format
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date format "${row.date}". Use YYYY-MM-DD`);
          continue;
        }

        // Validate type
        if (!['income', 'expense'].includes(row.type.toLowerCase())) {
          errors.push(`Row ${i + 1}: Type must be "income" or "expense", got "${row.type}"`);
          continue;
        }

        // Validate amount
        const amount = parseFloat(row.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${i + 1}: Amount must be a positive number, got "${row.amount}"`);
          continue;
        }

        data.push({
          date: row.date,
          type: row.type.toLowerCase(),
          category: getDisplayCategory(row.category),
          amount: amount,
          description: row.description || ''
        });
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return { data, errors };
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      onNotification('Please upload a CSV file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') {
          throw new Error('Failed to read file');
        }

        const { data, errors } = parseCSV(content);

        if (errors.length > 0) {
          setPreview({ errors, data: [], validCount: 0, totalCount: lines.length - 1 });
          return;
        }

        if (data.length === 0) {
          onNotification('No valid data found in CSV', 'error');
          return;
        }

        setPreview({
          data: data.slice(0, 10), // Show first 10 rows
          validCount: data.length,
          totalCount: data.length,
          errors: [],
          allData: data
        });
      } catch (error) {
        onNotification(`Error parsing CSV: ${error.message}`, 'error');
        setPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!preview?.allData || preview.allData.length === 0) {
      onNotification('No valid data to import', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await onImport(preview.allData);
      onNotification(`Successfully imported ${preview.allData.length} transactions`, 'success');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onNotification(`Import failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Import Transactions</h2>
        <p className="text-gray-600 dark:text-gray-400">Upload a CSV file to import multiple transactions at once</p>
      </div>

      {/* Upload Area */}
      <div className="glass-card p-12 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        
        <label htmlFor="csv-upload" className="cursor-pointer block">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileUp size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Drop CSV file here or click to browse
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* CSV Format Guide */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">CSV Format Guide</h3>
        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre className="text-gray-700 dark:text-gray-300">
{`date,type,category,amount,description
2024-01-15,expense,Food,500,Lunch
2024-01-15,income,Salary,50000,Monthly salary
2024-01-16,expense,Transport,50,Cab ride
2024-01-16,expense,Entertainment,1000,Movie tickets`}
          </pre>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><span className="font-bold">date</span>: YYYY-MM-DD format (required)</p>
          <p><span className="font-bold">type</span>: "income" or "expense" (required)</p>
          <p><span className="font-bold">category</span>: Any category name (required)</p>
          <p><span className="font-bold">amount</span>: Positive number (required)</p>
          <p><span className="font-bold">description</span>: Optional notes about the transaction</p>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="space-y-4">
          {/* Error Messages */}
          {preview.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle size={20} />
                Validation Errors
              </h4>
              <ul className="space-y-2">
                {preview.errors.slice(0, 10).map((error, idx) => (
                  <li key={idx} className="text-sm text-red-600 dark:text-red-300">
                    • {error}
                  </li>
                ))}
                {preview.errors.length > 10 && (
                  <li className="text-sm text-red-600 dark:text-red-300">
                    ... and {preview.errors.length - 10} more errors
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Valid Data Preview */}
          {preview.validCount > 0 && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  Valid Transactions
                </h4>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {preview.validCount} transaction{preview.validCount !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Date</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Type</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Category</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.data.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-slate-800">
                        <td className="px-4 py-2 text-gray-900 dark:text-white">{row.date}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${row.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                            {row.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">{row.category}</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-900 dark:text-white">
                          {formatCurrency(row.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {preview.validCount > 10 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Showing first 10 of {preview.validCount} transactions
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {preview.validCount > 0 && (
            <div className="flex gap-4">
              <button
                onClick={handleImport}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Import {preview.validCount} Transaction{preview.validCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex-1 px-6 py-3 bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      {!preview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Bulk Import</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Import hundreds of transactions at once</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Validated</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Each row is validated before import</p>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">Safe</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preview transactions before importing</p>
          </div>
        </div>
      )}
    </div>
  );
}
