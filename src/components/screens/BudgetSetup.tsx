import { useState } from 'react';
import { IndianRupee } from 'lucide-react';

interface BudgetSetupProps {
  categories: string[];
  onComplete: (budget: any) => void;
}

export default function BudgetSetup({ categories, onComplete }: BudgetSetupProps) {
  const [monthlyBudget, setMonthlyBudget] = useState('50000');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

  const budget = parseInt(monthlyBudget) || 0;
  const totalAllocated = Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0);
  const remaining = budget - totalAllocated;
  const percentAllocated = budget > 0 ? (totalAllocated / budget) * 100 : 0;

  const handleCategoryBudgetChange = (category: string, value: number) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleComplete = () => {
    onComplete({
      monthly: budget,
      categories: categoryBudgets
    });
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-purple-900 text-2xl mb-2">
          Set your budget
        </h1>
        <p className="text-purple-600">
          Define your monthly spending limits
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* Monthly Budget */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
          <label className="text-purple-900 block mb-3">Monthly Budget</label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-purple-50 rounded-2xl border-2 border-purple-100 focus:border-purple-500 outline-none transition-colors text-purple-900"
              placeholder="50000"
            />
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span>Allocated</span>
            <span>₹{totalAllocated.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>Remaining</span>
            <span className={remaining < 0 ? 'text-red-200' : ''}>
              ₹{remaining.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${Math.min(percentAllocated, 100)}%` }}
            ></div>
          </div>
          <p className="text-white/80 mt-2">
            {percentAllocated.toFixed(0)}% allocated
          </p>
        </div>

        {/* Category Budgets */}
        <div className="space-y-3">
          <h3 className="text-purple-900">Category Budgets (Optional)</h3>
          {categories.slice(0, 6).map(category => (
            <div key={category} className="bg-white rounded-2xl p-4 border border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-900 capitalize">{category}</span>
                <span className="text-purple-600">
                  ₹{(categoryBudgets[category] || 0).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={budget}
                step="500"
                value={categoryBudgets[category] || 0}
                onChange={(e) => handleCategoryBudgetChange(category, parseInt(e.target.value))}
                className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(147 51 234) 0%, rgb(147 51 234) ${((categoryBudgets[category] || 0) / budget) * 100}%, rgb(243 232 255) ${((categoryBudgets[category] || 0) / budget) * 100}%, rgb(243 232 255) 100%)`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-8 space-y-4 bg-gradient-to-t from-white to-transparent pt-4">
        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:shadow-lg transition-shadow"
        >
          Get Started
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
        </div>
        <p className="text-purple-400 text-center">Step 3 of 3</p>
      </div>
    </div>
  );
}
