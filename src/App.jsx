import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './hooks/useAuth';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import AuthOverlay from './components/AuthOverlay';
import Toast from './components/Toast';

function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
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

  if (!user) {
    return (
      <>
        <AuthOverlay
          onError={(msg) => showNotification(msg, 'error')}
          onSuccess={(msg) => showNotification(msg, 'success')}
        />
        <Toast notifications={notifications} onDismiss={dismissNotification} />
      </>
    );
  }

  return (
    <div className="bg-midnight text-white font-sans h-[100dvh] overflow-hidden flex flex-col">
      <Toast notifications={notifications} onDismiss={dismissNotification} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
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

          <div className={`page-view ${currentPage === 'profile' ? '' : 'hidden'}`}>
            <ProfileView />
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
