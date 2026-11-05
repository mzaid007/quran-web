import React from 'react';
import { Layers, Check } from 'lucide-react';

export type UiOption = 'option1' | 'option2' | 'option3';

interface DemoSwitcherProps {
  currentOption: UiOption;
  onChangeOption: (opt: UiOption) => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({
  currentOption,
  onChangeOption,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[94vw] animate-fade-in">
      <div className="bg-gray-900/90 dark:bg-black/90 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 text-emerald-400 font-bold text-xs uppercase tracking-wider hidden md:flex">
          <Layers className="w-4 h-4" />
          <span>UI Demo:</span>
        </div>

        {/* Option 1 */}
        <button
          onClick={() => onChangeOption('option1')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            currentOption === 'option1'
              ? 'bg-brand-teal text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="Option 1: Responsive hierarchy (Compact icons on mobile, full toolbar on desktop)"
        >
          {currentOption === 'option1' && <Check className="w-3.5 h-3.5" />}
          <span>Option 1: Responsive</span>
        </button>

        {/* Option 2 */}
        <button
          onClick={() => onChangeOption('option2')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            currentOption === 'option2'
              ? 'bg-brand-teal text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="Option 2: Minimal Nav (Removes header Ayah dropdown, uses Surah Card jump)"
        >
          {currentOption === 'option2' && <Check className="w-3.5 h-3.5" />}
          <span>Option 2: Minimal</span>
        </button>

        {/* Option 3 */}
        <button
          onClick={() => onChangeOption('option3')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            currentOption === 'option3'
              ? 'bg-brand-teal text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          title="Option 3: Bottom Dock (Thumb-friendly mobile bottom bar, clean top header)"
        >
          {currentOption === 'option3' && <Check className="w-3.5 h-3.5" />}
          <span>Option 3: Bottom Dock</span>
        </button>
      </div>
    </div>
  );
};
