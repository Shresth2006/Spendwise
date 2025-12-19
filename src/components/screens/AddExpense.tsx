import { useState } from 'react';
import { ArrowLeft, IndianRupee, Tag, Calendar, FileText, Check } from 'lucide-react';

interface AddExpenseProps {
  navigateTo: (screen: string) => void;
}

export default function AddExpense({ navigateTo }: AddExpenseProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Groceries', 'Dining', 'Transport', 'Shopping', 
    'Entertainment', 'Healthcare', 'Bills', 'Miscellaneous'
  ];

  const handleSave = () => {
    if (amount) {
      setShowSuccess(true);
      setTimeout(() => {
        navigateTo('home');
      }, 1500);
    }
  };

  if (showSuccess) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-purple-900 text-2xl mb-2">Expense Added!</h2>
        <p className="text-purple-600">Your expense has been recorded</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center gap-4">
        <button onClick={() => navigateTo('home')} className="text-purple-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-purple-900 text-2xl">Add Expense</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6">
        {/* Amount Input - Large & Prominent */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-purple-100">
          <label className="text-purple-600 block mb-3">Amount</label>
          <div className="relative">
            <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-purple-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-2 bg-transparent text-4xl text-purple-900 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-purple-900 flex items-center gap-2 px-2">
            <Tag className="w-5 h-5" />
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  py-3 rounded-2xl border-2 transition-all
                  ${category === cat 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 text-white shadow-lg' 
                    : 'bg-white border-purple-100 text-purple-700 hover:border-purple-300'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-blue-700">
              Auto-categorized as <span className="font-semibold">{category}</span> based on your spending patterns
            </p>
          </div>
        </div>

        {/* Date Picker */}
        <div className="space-y-3">
          <label className="text-purple-900 flex items-center gap-2 px-2">
            <Calendar className="w-5 h-5" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-4 bg-white rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors text-purple-900"
          />
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <label className="text-purple-900 flex items-center gap-2 px-2">
            <FileText className="w-5 h-5" />
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full px-4 py-4 bg-white rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors text-purple-900 resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleSave}
          disabled={!amount}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
        >
          Save Expense
        </button>
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-4 bg-white border-2 border-purple-100 text-purple-700 rounded-2xl hover:border-purple-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
