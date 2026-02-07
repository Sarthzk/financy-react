import { useAuth } from '../hooks/useAuth';
import { CheckCircle, Shield, Calendar, TrendingUp, PiggyBank } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProfileView(props) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [entries, setEntries] = useState(props.entries || []);

  // Fetch budgets from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'budgets'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetData = [];
      snapshot.forEach((doc) => {
        budgetData.push({ id: doc.id, ...doc.data() });
      });
      setBudgets(budgetData);
    });

    return () => unsubscribe();
  }, [user]);

  // Update entries from props
  useEffect(() => {
    if (props.entries) {
      setEntries(props.entries);
    }
  }, [props.entries]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  const displayName = user.displayName || 'Unnamed User';
  const initial = displayName.charAt(0).toUpperCase();

  // Format the member since date
  const memberSinceDate = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently joined';

  // Calculate total transactions
  const totalTransactions = entries.length;

  // Calculate total savings goal
  const totalSavingsGoal = budgets.reduce((sum, budget) => {
    const spent = entries
      .filter(e => e.category === budget.category && e.type === 'expense')
      .reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    const limit = parseFloat(budget.limit || 0);
    return sum + (limit - spent);
  }, 0);

  const savingsGoalPercentage = budgets.length > 0 
    ? Math.round((totalSavingsGoal / budgets.reduce((sum, b) => sum + parseFloat(b.limit || 0), 0)) * 100)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 pt-8">
        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Your account information and settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors text-center space-y-8">
        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-full h-full rounded-full border-4 border-primary object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-primary bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-5xl font-bold text-primary uppercase">
              {initial}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium break-all">{user.email}</p>
        </div>

        {/* Account Status Grid */}
        <div className="pt-8 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={16} className="text-green-600 dark:text-green-500" />
              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase">Status</p>
            </div>
            <p className="text-green-700 dark:text-green-400 font-bold">Active User</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-blue-600 dark:text-blue-500" />
              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase">Security</p>
            </div>
            <p className="text-blue-700 dark:text-blue-400 font-bold">Verified</p>
          </div>
        </div>
      </div>

      {/* Account Details - Unified Stats */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-slate-700 transition-colors space-y-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
            Account Email
          </h3>
          <p className="text-gray-600 dark:text-gray-400 break-all">{user.email}</p>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
            Account Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Display Name */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase mb-2">Display Name</p>
              <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{displayName}</p>
            </div>

            {/* Member Since */}
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
              <div className="flex items-center gap-1 mb-2">
                <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase">Member Since</p>
              </div>
              <p className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{memberSinceDate.split(',')[0]}</p>
            </div>

            {/* Total Transactions */}
            <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp size={14} className="text-green-600 dark:text-green-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase">Transactions</p>
              </div>
              <p className="text-green-700 dark:text-green-300 font-semibold text-sm">{totalTransactions}</p>
            </div>

            {/* Savings Goal Progress */}
            {budgets.length > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
                <div className="flex items-center gap-1 mb-2">
                  <PiggyBank size={14} className="text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase">Savings</p>
                </div>
                <p className="text-purple-700 dark:text-purple-300 font-semibold text-sm">{Math.max(0, savingsGoalPercentage)}% On Track</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
