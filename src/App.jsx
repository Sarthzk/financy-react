import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import CategoryAnalytics from './components/CategoryAnalytics';
import MonthlyTrends from './components/MonthlyTrends';
import BudgetAlerts from './components/BudgetAlerts';
import CSVImport from './components/CSVImport';
import AuthOverlay from './components/AuthOverlay';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage';




function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [entries, setEntries] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(collection(db, 'entries'), where('uid', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        let sortTime;
        
        if (data.createdAt && typeof data.createdAt.toMillis === 'function') {
          sortTime = data.createdAt.toMillis();
        } else if (data.createdAt) {
          sortTime = new Date(data.createdAt).getTime();
        } else {
          sortTime = new Date(data.date || Date.now()).getTime();
        }
        
        entriesData.push({
          id: doc.id,
          ...data,
          sortTime
        });
      });
      
      entriesData.sort((a, b) => b.sortTime - a.sortTime);
      setEntries(entriesData);
    });

    return () => unsubscribe();
  }, [user]);

  const totalIncome = entries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpenses = entries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteDoc(doc(db, 'entries', entryId));
      showNotification('Transaction deleted', 'success');
    } catch (error) {
      console.error('Error deleting entry:', error);
      showNotification('Error deleting transaction', 'error');
    }
  };

  const handleImportCSV = async (transactions) => {
    if (!user) {
      showNotification('User not authenticated', 'error');
      return;
    }

    try {
      const batch = transactions.map(trans =>
        addDoc(collection(db, 'entries'), {
          ...trans,
          uid: user.uid,
          createdAt: serverTimestamp()
        })
      );

      await Promise.all(batch);
      showNotification(`Successfully imported ${transactions.length} transactions`, 'success');
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw new Error('Failed to import transactions');
    }
  };

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-midnight">
        <div className="text-white text-xl font-bold">Loading...</div>
      </div>
    );
  }

  // 1. If not logged in and hasn't clicked "Join" -> Show Landing Page
if (!user && !showAuth) {
  return (
    <>
      <LandingPage onJoin={() => setShowAuth(true)} />
      <Toast notifications={notifications} onDismiss={dismissNotification} />
    </>
  );
}

// 2. If not logged in but clicked "Join" -> Show Auth Screen
if (!user && showAuth) {
  return (
    <>
      <AuthOverlay
        onError={(msg) => showNotification(msg, 'error')}
        onSuccess={() => {
          setShowAuth(false);
          showNotification('Logged in successfully!', 'success');
        }}
        onBack={() => setShowAuth(false)}
      />
      <Toast notifications={notifications} onDismiss={dismissNotification} />
    </>
  );
}

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-white font-sans h-[100dvh] overflow-hidden flex flex-col transition-colors">
      <Toast notifications={notifications} onDismiss={dismissNotification} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 pt-20 lg:pt-6 bg-white dark:bg-slate-950 transition-colors">
          <div className={`page-view ${currentPage === 'dashboard' ? '' : 'hidden'}`}>
            <DashboardView
              entries={entries}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
              onDeleteEntry={handleDeleteEntry}
              onNotification={showNotification}
            />
          </div>

          <div className={`page-view ${currentPage === 'history' ? '' : 'hidden'}`}>
            <HistoryView
              entries={entries}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>

          <div className={`page-view ${currentPage === 'analytics' ? '' : 'hidden'}`}>
            <CategoryAnalytics entries={entries} />
          </div>

          <div className={`page-view ${currentPage === 'trends' ? '' : 'hidden'}`}>
            <MonthlyTrends entries={entries} />
          </div>

          <div className={`page-view ${currentPage === 'budget' ? '' : 'hidden'}`}>
            <BudgetAlerts entries={entries} onNotification={showNotification} />
          </div>

          <div className={`page-view ${currentPage === 'import' ? '' : 'hidden'}`}>
            <CSVImport onImport={handleImportCSV} onNotification={showNotification} />
          </div>

          <div className={`page-view ${currentPage === 'profile' ? '' : 'hidden'}`}>
            <ProfileView entries={entries} />
          </div>

          <footer className="mt-12 py-8 border-t border-border/50 text-center">
            <p className="text-slate-600 text-sm font-medium tracking-wide">
              © 2026 Sarthak Mohite. All Rights Reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
