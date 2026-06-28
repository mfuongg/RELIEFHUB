import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-sky-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const colors = {
  success: 'border-l-emerald-500 bg-white',
  error: 'border-l-red-500 bg-white',
  info: 'border-l-sky-500 bg-white',
  warning: 'border-l-amber-500 bg-white',
};

export default function Toast({ message, type = 'success' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border-l-4 max-w-sm ${colors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium text-gray-800">{message}</span>
    </motion.div>
  );
}
