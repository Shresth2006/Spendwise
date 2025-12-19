import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import BottomNavigation from '../BottomNavigation';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpendingCalendarProps {
  navigateTo: (screen: string) => void;
}

export default function SpendingCalendar({ navigateTo }: SpendingCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [currentMonth, setCurrentMonth] = useState(11); // December (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  // Calculate calendar parameters
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = isCurrentMonth ? today.getDate() : null;

  // Navigate to previous month
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null); // Clear selection when changing months
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null); // Clear selection when changing months
  };

  // Mock spending data for each day
  const dailySpending: Record<number, { amount: number; status: 'normal' | 'high' | 'overspend' }> = {
    1: { amount: 1200, status: 'normal' },
    2: { amount: 890, status: 'normal' },
    3: { amount: 2100, status: 'high' },
    4: { amount: 1450, status: 'normal' },
    5: { amount: 980, status: 'normal' },
    6: { amount: 3200, status: 'overspend' },
    7: { amount: 2800, status: 'high' },
    8: { amount: 1100, status: 'normal' },
    9: { amount: 1350, status: 'normal' },
    10: { amount: 2600, status: 'high' },
    11: { amount: 890, status: 'normal' },
    12: { amount: 1200, status: 'normal' },
    13: { amount: 3500, status: 'overspend' },
    14: { amount: 1800, status: 'normal' },
  };

  const dayExpenses = selectedDay ? [
    { category: 'Groceries', amount: 650, time: '10:30 AM' },
    { category: 'Transport', amount: 245, time: '2:15 PM' },
    { category: 'Dining', amount: 905, time: '7:45 PM' },
  ] : [];

  // Prepare chart data - convert dailySpending to array format for Recharts
  const chartData = Object.entries(dailySpending).map(([day, data]) => ({
    day: parseInt(day),
    amount: data.amount,
    status: data.status,
  })).sort((a, b) => a.day - b.day);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700';
      case 'high': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700';
      case 'overspend': return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700';
      default: return 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-700 dark:text-green-400';
      case 'high': return 'text-yellow-700 dark:text-yellow-400';
      case 'overspend': return 'text-red-700 dark:text-red-400';
      default: return 'text-gray-700 dark:text-gray-400';
    }
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-600 rounded-xl p-3 shadow-lg">
          <p className="text-purple-900 dark:text-white">Day {payload[0].payload.day}</p>
          <p className="text-purple-600 dark:text-purple-400">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigateTo('home')} className="text-purple-600 dark:text-purple-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-purple-900 dark:text-white text-2xl flex-1">Calendar</h1>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 dark:border-gray-700">
          <button className="text-purple-600 dark:text-purple-400" onClick={handlePreviousMonth}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-purple-900 dark:text-white">{monthNames[currentMonth]} {currentYear}</span>
          <button className="text-purple-600 dark:text-purple-400" onClick={handleNextMonth}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4">
        {/* Spending Trend Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-4 border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-900 dark:text-white">Spending Trend</h3>
            {/* Chart type toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'bar' 
                    ? 'bg-purple-600 text-white dark:bg-purple-500' 
                    : 'bg-purple-100 text-purple-600 dark:bg-gray-700 dark:text-purple-400'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  chartType === 'line' 
                    ? 'bg-purple-600 text-white dark:bg-purple-500' 
                    : 'bg-purple-100 text-purple-600 dark:bg-gray-700 dark:text-purple-400'
                }`}
              >
                Line
              </button>
            </div>
          </div>
          
          {/* Chart visualization */}
          <ResponsiveContainer width="100%" height={180}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#9ca3af' }} 
                  className="dark:fill-gray-400"
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  className="dark:fill-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="#9333ea" 
                  radius={[8, 8, 0, 0]}
                  className="dark:fill-purple-500"
                />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#9ca3af' }} 
                  className="dark:fill-gray-400"
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  className="dark:fill-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#9333ea" 
                  strokeWidth={3}
                  dot={{ fill: '#9333ea', r: 4 }}
                  className="dark:stroke-purple-500"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-4 border border-purple-100 dark:border-gray-700">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-purple-600 dark:text-purple-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const spending = dailySpending[day];
              const isToday = day === todayDate;
              const isSelected = day === selectedDay;
              const hasData = !!spending;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative transition-all
                    ${isToday ? 'ring-2 ring-purple-500 dark:ring-purple-400 ring-offset-2 dark:ring-offset-gray-800' : ''}
                    ${isSelected ? 'scale-95' : 'hover:scale-105'}
                    ${hasData ? getStatusColor(spending.status) : 'bg-white dark:bg-gray-800 border-purple-100 dark:border-gray-700'}
                  `}
                >
                  <span className={`${hasData ? getStatusTextColor(spending.status) : 'text-purple-400 dark:text-gray-500'}`}>
                    {day}
                  </span>
                  {hasData && (
                    <span className={`text-xs mt-0.5 ${getStatusTextColor(spending.status)}`}>
                      ₹{spending.amount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 dark:border-gray-700">
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded"></div>
              <span className="text-purple-700 dark:text-gray-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded"></div>
              <span className="text-purple-700 dark:text-gray-300">Slightly High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded"></div>
              <span className="text-purple-700 dark:text-gray-300">Overspend</span>
            </div>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-purple-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-purple-900 dark:text-white">{monthNames[currentMonth]} {selectedDay}, {currentYear}</h3>
              <span className="text-purple-900 dark:text-white">
                ₹{dailySpending[selectedDay]?.amount.toLocaleString() || '0'}
              </span>
            </div>
            <div className="space-y-3">
              {dayExpenses.length > 0 ? (
                dayExpenses.map((expense, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-purple-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-purple-900 dark:text-white">{expense.category}</p>
                      <p className="text-purple-500 dark:text-purple-400">{expense.time}</p>
                    </div>
                    <p className="text-purple-900 dark:text-white">₹{expense.amount}</p>
                  </div>
                ))
              ) : (
                <p className="text-purple-600 dark:text-purple-400 text-center py-4">No expenses recorded for this day</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="calendar" onNavigate={navigateTo} />
    </div>
  );
}