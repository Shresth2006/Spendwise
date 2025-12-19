import { ArrowLeft, Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';
import { useState } from 'react';

interface GoalsSavingsProps {
  navigateTo: (screen: string) => void;
  goals: Array<{
    id: number;
    name: string;
    target: number;
    current: number;
    deadline: string;
    color: string;
    suggestedDaily: number;
  }>;
  onAddGoal: (goal: { name: string; target: number; deadline: string }) => void;
}

export default function GoalsSavings({ navigateTo, goals, onAddGoal }: GoalsSavingsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  const handleCreateGoal = () => {
    if (newGoalName && newGoalTarget) {
      onAddGoal({
        name: newGoalName,
        target: parseFloat(newGoalTarget),
        deadline: newGoalDeadline || 'No deadline'
      });
      // Reset form
      setNewGoalName('');
      setNewGoalTarget('');
      setNewGoalDeadline('');
      setShowCreateModal(false);
    }
  };

  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 flex items-center gap-4">
        <button onClick={() => navigateTo('home')} className="text-purple-600 dark:text-purple-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-purple-900 dark:text-white text-2xl">Goals & Savings</h1>
          <p className="text-purple-600 dark:text-purple-400">Track your financial goals</p>
        </div>
        <button className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Total Savings Overview */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-3xl p-6 text-white shadow-lg">
          <p className="text-purple-100 mb-2">Total Savings</p>
          <h2 className="text-4xl mb-4">₹{totalSavings.toLocaleString()}</h2>
          <div className="flex justify-between items-center">
            <span className="text-purple-100">Target: ₹{totalTarget.toLocaleString()}</span>
            <span className="text-purple-100">{overallProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        {/* Goals List */}
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          
          return (
            <div key={goal.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-purple-100 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-purple-900 dark:text-white mb-1">{goal.name}</h3>
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Calendar className="w-4 h-4" />
                    <span>{goal.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-purple-900 dark:text-white mb-2">
                  <span>₹{goal.current.toLocaleString()}</span>
                  <span>₹{goal.target.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-purple-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${goal.color}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-purple-600 dark:text-purple-400 mt-2">
                  {progress.toFixed(0)}% complete · ₹{remaining.toLocaleString()} remaining
                </p>
              </div>

              {/* Smart Prompt */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-900 dark:text-green-300">Smart Suggestion</span>
                </div>
                <p className="text-green-700 dark:text-green-400">
                  Add ₹{goal.suggestedDaily} today to stay on track for your goal
                </p>
                <button className="w-full mt-3 py-2 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                  Add ₹{goal.suggestedDaily}
                </button>
              </div>
            </div>
          );
        })}

        {/* Create New Goal */}
        <button onClick={() => setShowCreateModal(true)} className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-dashed border-purple-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
          <div className="flex flex-col items-center gap-3 text-purple-600 dark:text-purple-400">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span>Create New Goal</span>
          </div>
        </button>
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm border border-purple-100 dark:border-gray-700">
            <h3 className="text-purple-900 dark:text-white text-xl mb-4">Create New Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-purple-700 dark:text-purple-400 block mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g., New Phone"
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-gray-700 border border-purple-200 dark:border-gray-600 text-purple-900 dark:text-white placeholder:text-purple-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-purple-700 dark:text-purple-400 block mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-gray-700 border border-purple-200 dark:border-gray-600 text-purple-900 dark:text-white placeholder:text-purple-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-purple-700 dark:text-purple-400 block mb-2">Deadline (Optional)</label>
                <input
                  type="text"
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  placeholder="e.g., Dec 2025"
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-gray-700 border border-purple-200 dark:border-gray-600 text-purple-900 dark:text-white placeholder:text-purple-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!newGoalName || !newGoalTarget}
                  className="flex-1 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-xl hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation active="goals" onNavigate={navigateTo} />
    </div>
  );
}