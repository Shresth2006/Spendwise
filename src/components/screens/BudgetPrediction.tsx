import { ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface BudgetPredictionProps {
  navigateTo: (screen: string) => void;
}

export default function BudgetPrediction({ navigateTo }: BudgetPredictionProps) {
  const monthlyBudget = 50000;
  const predictedSpend = 54200;
  const overspend = predictedSpend - monthlyBudget;

  const data = [
    { month: 'Aug', actual: 45200, budget: 50000 },
    { month: 'Sep', actual: 48900, budget: 50000 },
    { month: 'Oct', actual: 51200, budget: 50000 },
    { month: 'Nov', actual: 47800, budget: 50000 },
    { month: 'Dec', current: 32450, predicted: 54200, budget: 50000 },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center gap-4">
        <button onClick={() => navigateTo('home')} className="text-purple-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-purple-900 text-2xl">Budget Prediction</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Alert Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 border border-red-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 mb-1">Budget Warning</h3>
              <p className="text-red-700">
                At your current pace, you may exceed your budget by <span className="font-semibold">₹{overspend.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-100">
          <h3 className="text-purple-900 mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
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
              <ReferenceLine y={monthlyBudget} stroke="#9333ea" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#9333ea" 
                strokeWidth={3}
                dot={{ fill: '#9333ea', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#ef4444" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-purple-600 rounded"></div>
              <span className="text-purple-700">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 5px, transparent 5px, transparent 10px)' }}></div>
              <span className="text-purple-700">Predicted</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-100">
          <h3 className="text-purple-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Smart Insights
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 bg-purple-500 rounded-full"></div>
              <p className="text-purple-700">
                Your dining expenses are 40% higher than last month
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 bg-purple-500 rounded-full"></div>
              <p className="text-purple-700">
                Try reducing coffee shop visits by 3 per week to save ₹1,800
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 bg-purple-500 rounded-full"></div>
              <p className="text-purple-700">
                You've been spending more on weekends - consider meal prepping
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white">
          <h3 className="mb-3">Suggested Action</h3>
          <p className="text-purple-100 mb-4">
            To stay within budget, try limiting daily spending to ₹1,200 for the rest of the month
          </p>
          <button className="w-full py-3 bg-white text-purple-600 rounded-2xl hover:shadow-lg transition-shadow">
            Set Daily Limit
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="home" onNavigate={navigateTo} />
    </div>
  );
}
