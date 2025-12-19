import { useState } from 'react';
import { 
  ShoppingCart, Utensils, Home, Car, Heart, Shirt, 
  Smartphone, Plane, GraduationCap, Gift, Coffee, 
  Dumbbell, Music, Gamepad2, PawPrint, Wrench,
  Sparkles, TrendingUp, CreditCard, MoreHorizontal
} from 'lucide-react';

interface CategoryPersonalizationProps {
  onComplete: (categories: string[]) => void;
  initialSelected: string[];
}

const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: ShoppingCart },
  { id: 'dining', label: 'Dining Out', icon: Utensils },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'healthcare', label: 'Healthcare', icon: Heart },
  { id: 'clothing', label: 'Clothing', icon: Shirt },
  { id: 'electronics', label: 'Electronics', icon: Smartphone },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'gifts', label: 'Gifts', icon: Gift },
  { id: 'coffee', label: 'Coffee & Tea', icon: Coffee },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'entertainment', label: 'Entertainment', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'beauty', label: 'Beauty', icon: Sparkles },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'bills', label: 'Bills', icon: CreditCard },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: MoreHorizontal },
];

export default function CategoryPersonalization({ onComplete, initialSelected }: CategoryPersonalizationProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleCategory = (id: string) => {
    if (id === 'miscellaneous') return; // Always selected
    
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    onComplete(selected);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-purple-900 text-2xl mb-2">
          Choose your categories
        </h1>
        <p className="text-purple-600">
          Select the expense categories you use most
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isSelected = selected.includes(id);
            const isMiscellaneous = id === 'miscellaneous';
            
            return (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                className={`
                  p-4 rounded-2xl border-2 transition-all
                  ${isSelected 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 text-white shadow-lg' 
                    : 'bg-white border-purple-100 text-purple-600 hover:border-purple-300'
                  }
                  ${isMiscellaneous ? 'opacity-100' : ''}
                `}
                disabled={isMiscellaneous}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
                <span className="text-xs block leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-8 space-y-4 bg-gradient-to-t from-white to-transparent pt-4">
        <p className="text-purple-600 text-center">
          {selected.length} categories selected
        </p>
        
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:shadow-lg transition-shadow"
        >
          Continue
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-purple-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-purple-200 rounded-full"></div>
        </div>
        <p className="text-purple-400 text-center">Step 2 of 3</p>
      </div>
    </div>
  );
}
