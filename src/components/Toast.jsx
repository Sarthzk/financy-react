import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast({ notifications, onDismiss }) {
  useEffect(() => {
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        onDismiss(notification.id);
      }, 4000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, onDismiss]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[6000] flex flex-col gap-3 w-full max-w-md px-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 rounded-2xl border-l-4 shadow-lg ${getStyles(notification.type)}`}
          >
            <div className="flex items-center gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 font-medium text-sm text-midnight">
                {notification.message}
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
