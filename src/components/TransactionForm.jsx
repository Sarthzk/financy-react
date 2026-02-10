import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { sanitizeInput, getDisplayCategory, normalizeCategoryKey } from '../utils/helpers';

export default function TransactionForm({ onSuccess, onError }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !category) {
      onError('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'entries'), {
        uid: auth.currentUser.uid,
        type,
        amount: parseFloat(amount),
        category: getDisplayCategory(sanitizeInput(category)),
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setAmount('');
      setCategory('');
      setType('expense');
      
      onSuccess('Entry saved successfully');
    } catch (error) {
      console.error('Error saving entry:', error);
      onError('Error saving entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors">
      <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Quick Entry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary text-gray-900 dark:text-white font-medium transition-colors"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Amount (₹)"
          className="w-full p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary text-gray-900 dark:text-white font-medium transition-colors"
          disabled={isSubmitting}
        />
        
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Category"
          className="w-full p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg outline-none focus:border-primary text-gray-900 dark:text-white font-medium transition-colors"
          disabled={isSubmitting}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Save Entry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
