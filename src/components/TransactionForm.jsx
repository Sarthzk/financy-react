import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { sanitizeInput } from '../utils/helpers';

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
        category: sanitizeInput(category),
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
    <div className="glass-card p-8 rounded-[2.5rem]">
      <h3 className="font-bold text-xl mb-6 text-white">Quick Entry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-4 bg-dark border border-border rounded-2xl outline-none focus:border-primary text-white font-medium select-right-arrow"
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
          className="w-full p-4 bg-dark border border-border rounded-2xl outline-none focus:border-primary text-white font-medium"
          disabled={isSubmitting}
        />
        
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Category"
          className="w-full p-4 bg-dark border border-border rounded-2xl outline-none focus:border-primary text-white font-medium"
          disabled={isSubmitting}
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-dark p-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Entry</span>
          )}
        </button>
      </form>
    </div>
  );
}
