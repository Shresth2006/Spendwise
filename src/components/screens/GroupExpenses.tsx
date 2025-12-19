import { ArrowLeft, User, Clock } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';

interface GroupExpensesProps {
  navigateTo: (screen: string) => void;
}

export default function GroupExpenses({ navigateTo }: GroupExpensesProps) {
  const pendingPayments = [
    {
      id: 1,
      contact: 'Rahul Kumar',
      amount: 450,
      category: 'Dining',
      description: 'Dinner at Italian Restaurant',
      daysAgo: 2,
      autoDetected: true
    },
    {
      id: 2,
      contact: 'Priya Sharma',
      amount: 320,
      category: 'Transport',
      description: 'Uber ride split',
      daysAgo: 5,
      autoDetected: true
    },
    {
      id: 3,
      contact: 'Amit Patel',
      amount: 280,
      category: 'Entertainment',
      description: 'Movie tickets',
      daysAgo: 7,
      autoDetected: false
    },
    {
      id: 4,
      contact: 'Sneha Reddy',
      amount: 190,
      category: 'Coffee',
      description: 'Cafe bill split',
      daysAgo: 12,
      autoDetected: true
    },
  ];

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Sort by FIFO (oldest first)
  const sortedPayments = [...pendingPayments].sort((a, b) => b.daysAgo - a.daysAgo);

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigateTo('home')} className="text-purple-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-purple-900 text-2xl">Pending Payments</h1>
            <p className="text-purple-600">Track shared expenses</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Total Pending Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <p className="text-purple-100 mb-2">Total Pending</p>
          <h2 className="text-4xl mb-2">₹{totalPending.toLocaleString()}</h2>
          <p className="text-purple-100">{sortedPayments.length} pending payments</p>
        </div>

        {/* Pending Payments List - FIFO Order */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-purple-900">Oldest First</h3>
            <div className="flex items-center gap-1 text-purple-600">
              <Clock className="w-4 h-4" />
              <span>FIFO Order</span>
            </div>
          </div>

          {sortedPayments.map((payment, index) => (
            <div 
              key={payment.id} 
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 relative"
            >
              {/* FIFO Position Indicator */}
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                  Oldest
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Contact Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  {/* Contact Name & Time */}
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-purple-900">{payment.contact}</h4>
                    <span className="text-purple-900">₹{payment.amount}</span>
                  </div>

                  {/* Description */}
                  <p className="text-purple-600 mb-2">{payment.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {payment.category}
                    </span>
                    <span className="text-purple-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {payment.daysAgo} days ago
                    </span>
                    {payment.autoDetected && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Auto-detected from SMS
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                      Mark as Paid
                    </button>
                    <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors">
                      Remind
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-blue-900 mb-1">Auto-Detection Active</p>
          <p className="text-blue-700">
            We automatically detect split payments from your SMS messages to help you track shared expenses
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="home" onNavigate={navigateTo} />
    </div>
  );
}
