import { LayoutDashboard, Briefcase, CheckSquare, Calendar, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const items = [
    { icon: LayoutDashboard, active: true },
    { icon: Briefcase, active: false },
    { icon: CheckSquare, active: false },
    { icon: Calendar, active: false },
  ];

  return (
    <nav className="w-16 h-full bg-slate-900 flex flex-col items-center py-4 space-y-8 flex-shrink-0 z-20">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
        OS
      </div>
      
      <div className="flex-1 flex flex-col gap-6 w-full items-center">
        {items.map((item, idx) => (
          <button 
            key={idx}
            className={cn(
              "p-1.5 rounded transition-all relative group flex items-center justify-center border-2",
              item.active 
                ? "border-white/20 bg-white/10 text-white opacity-100" 
                : "border-transparent text-white opacity-50 hover:opacity-100 hover:border-white/20"
            )}
          >
            <item.icon size={18} strokeWidth={item.active ? 2.5 : 2} />
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <button className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-600 transition-colors">
          <Settings size={16} strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}
