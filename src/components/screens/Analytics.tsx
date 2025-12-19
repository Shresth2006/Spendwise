import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalyticsProps {
  navigateTo: (screen: string) => void;
}

export default function Analytics({ navigateTo }: AnalyticsProps) {
  // Category-wise spending data
  const categoryData = [
    { name: 'Groceries', value: 8500, color: '#9333ea' },
    { name: 'Dining', value: 6200, color: '#3b82f6' },
    { name: 'Transport', value: 4800, color: '#10b981' },
    { name: 'Shopping', value: 5400, color: '#f59e0b' },
    { name: 'Entertainment', value: 3200, color: '#ef4444' },
    { name: 'Bills', value: 4350, color: '#8b5cf6' },
  ];

  // Monthly comparison data
  const monthlyComparison = [
    { month: 'Aug', spending: 45200 },
    { month: 'Sep', spending: 48900 },
    { month: 'Oct', spending: 51200 },
    { month: 'Nov', spending: 47800 },
    { month: 'Dec', spending: 32450 },
  ];

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  const lastMonthTotal = 47800;
  const thisMonthTotal = 32450;
  const percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center gap-4">
        <button onClick={() => navigateTo('home')} className="text-purple-600 dark:text-purple-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-purple-900 dark:text-white text-2xl">Analytics</h1>
          <p className="text-purple-600 dark:text-purple-400">Spending insights</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Monthly Overview */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-3xl p-6 text-white shadow-lg">
          <p className="text-purple-100 mb-2">December Spending</p>
          <h2 className="text-4xl mb-4">₹{thisMonthTotal.toLocaleString()}</h2>
          <div className="flex items-center gap-2">
            {percentChange < 0 ? (
              <>
                <TrendingDown className="w-5 h-5 text-green-300" />
                <span className="text-green-300">
                  {Math.abs(percentChange).toFixed(1)}% less than last month
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-red-300" />
                <span className="text-red-300">
                  {percentChange.toFixed(1)}% more than last month
                </span>
              </>
            )}
          </div>
        </div>

        {/* Category Breakdown - Pie Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                ></div>
                <div className="flex-1">
                  <p className="text-purple-900 dark:text-white">{cat.name}</p>
                  <p className="text-purple-600 dark:text-purple-400">₹{cat.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-purple-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-purple-900 dark:text-white">Total</span>
              <span className="text-purple-900 dark:text-white">₹{totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Monthly Trends - Bar Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
              <XAxis dataKey="month" stroke="#9333ea" />
              <YAxis stroke="#9333ea" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e9d5ff',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="spending" fill="#9333ea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison with Previous Month */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white mb-4">Month-over-Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-700 dark:text-gray-300">November 2024</span>
              <span className="text-purple-900 dark:text-white">₹{lastMonthTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700 dark:text-gray-300">December 2024 (so far)</span>
              <span className="text-purple-900 dark:text-white">₹{thisMonthTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-purple-100 dark:border-gray-700">
              <span className="text-purple-700 dark:text-gray-300">Difference</span>
              <span className={percentChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {percentChange < 0 ? '-' : '+'}₹{Math.abs(thisMonthTotal - lastMonthTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Top Spending Days */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 dark:border-gray-700">
          <h3 className="text-purple-900 dark:text-white mb-4">Highest Spending Days</h3>
          <div className="space-y-3">
            {[
              { date: 'Dec 13', amount: 3500 },
              { date: 'Dec 10', amount: 2600 },
              { date: 'Dec 7', amount: 2800 },
            ].map((day, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-purple-700 dark:text-gray-300">{day.date}</span>
                <span className="text-purple-900 dark:text-white">₹{day.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="analytics" onNavigate={navigateTo} />
    </div>
  );
}