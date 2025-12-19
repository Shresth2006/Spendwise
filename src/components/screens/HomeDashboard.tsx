import { Plus, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';

interface HomeDashboardProps {
  userName: string;
  navigateTo: (screen: string) => void;
}

export default function HomeDashboard({ userName, navigateTo }: HomeDashboardProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  const monthlyBudget = 50000;
  const currentSpend = 32450;
  const percentSpent = (currentSpend / monthlyBudget) * 100;
  const predictedSpend = 54200;
  const willExceed = predictedSpend > monthlyBudget;

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-purple-900 dark:text-white text-2xl mb-1">
          {greeting}, {userName || 'there'}
        </h1>
        <p className="text-purple-600 dark:text-purple-400">Here's your spending summary</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Monthly Progress Card */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-purple-100 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-600 dark:text-purple-400 mb-1">This Month</p>
              <h2 className="text-purple-900 dark:text-white text-3xl">₹{currentSpend.toLocaleString()}</h2>
              <p className="text-purple-500 dark:text-gray-400 mt-1">of ₹{monthlyBudget.toLocaleString()}</p>
            </div>
            <div className="relative w-20 h-20">
              {/* Circular Progress */}
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgb(243 232 255)"
                  className="dark:stroke-gray-700"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgb(147 51 234)"
                  className="dark:stroke-purple-500"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - percentSpent / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-purple-900 dark:text-white">{percentSpent.toFixed(0)}%</span>
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-purple-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Prediction Alert Card */}
        <button 
          onClick={() => navigateTo('budgetPrediction')}
          className={`w-full text-left ${
            willExceed 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800' 
              : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
          } rounded-3xl p-5 border shadow-sm`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              willExceed ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {willExceed ? (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={willExceed ? 'text-red-900 dark:text-red-300' : 'text-green-900 dark:text-green-300'}>
                {willExceed ? 'Budget Alert' : 'On Track'}
              </h3>
              <p className={`mt-1 ${willExceed ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                {willExceed 
                  ? `At your current pace, you may exceed your budget by ₹${(predictedSpend - monthlyBudget).toLocaleString()}`
                  : 'You are on track to stay within your budget this month'
                }
              </p>
            </div>
            <ArrowRight className={willExceed ? 'text-red-400 dark:text-red-500' : 'text-green-400 dark:text-green-500'} />
          </div>
        </button>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigateTo('goals')}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 dark:border-gray-700 text-left"
          >
            <p className="text-purple-600 dark:text-purple-400 mb-1">Active Goals</p>
            <p className="text-purple-900 dark:text-white text-2xl">3</p>
          </button>
          <button
            onClick={() => navigateTo('groupExpenses')}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 dark:border-gray-700 text-left"
          >
            <p className="text-purple-600 dark:text-purple-400 mb-1">Pending Payments</p>
            <p className="text-purple-900 dark:text-white text-2xl">₹1,240</p>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { name: 'Grocery Store', amount: 2340, category: 'Groceries', date: 'Today' },
              { name: 'Uber Ride', amount: 245, category: 'Transport', date: 'Yesterday' },
              { name: 'Coffee Shop', amount: 180, category: 'Dining', date: 'Yesterday' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-purple-900 dark:text-white">{tx.name}</p>
                  <p className="text-purple-500 dark:text-gray-400">{tx.category} · {tx.date}</p>
                </div>
                <p className="text-purple-900 dark:text-white">-₹{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => navigateTo('addExpense')}
        className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2} />
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation active="home" onNavigate={navigateTo} />
    </div>
  );
}