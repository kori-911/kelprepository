import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { mockDeals, Deal } from '../data/mock';
import { cn } from '../lib/utils';
import { calculateDealScore } from '../lib/scoring';

interface DealPanelProps {
  activeDealId: string | null;
  onSelectDeal: (id: string | null) => void;
}

export function DealPanel({ activeDealId, onSelectDeal }: DealPanelProps) {
  // Sort deals by score descending
  const sortedDeals = [...mockDeals].sort((a, b) => calculateDealScore(b) - calculateDealScore(a));

  return (
    <aside className="w-60 h-full border-r border-slate-200 bg-white flex flex-col flex-shrink-0 z-10 hidden md:flex">
      <div className="p-4 border-b border-slate-100 flex-shrink-0 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Deals</h2>
          <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-50 border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors text-slate-500">
            <Plus size={12} />
          </button>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find deals..." 
            className="w-full bg-slate-50 border border-slate-200 rounded pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-2 flex flex-col gap-1">
        {sortedDeals.map(deal => (
           <DealCard 
             key={deal.id} 
             deal={deal} 
             isActive={activeDealId === deal.id}
             onClick={() => onSelectDeal(deal.id)}
           />
        ))}
      </div>
      <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200 shrink-0">
        <div className="text-[10px] font-mono text-slate-400 uppercase">System Status</div>
        <div className="flex items-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span className="text-[11px] text-slate-600 font-medium">AI Engine Active</span>
        </div>
      </div>
    </aside>
  );
}

function DealCard({ deal, isActive, onClick }: { deal: Deal; isActive: boolean; onClick: () => void }) {
  const score = calculateDealScore(deal);
  
  // Determine score color based on health risk
  const scoreColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                     score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                     'text-red-700 bg-red-50 border-red-200';

  return (
    <div 
      className={cn(
        "p-2 rounded-sm cursor-pointer group flex flex-col transition-colors relative",
        isActive 
          ? "bg-blue-50 border-r-2 border-r-blue-600" 
          : "hover:bg-slate-50 border-r-2 border-r-transparent"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start pr-6">
        <div className={cn("text-xs font-semibold truncate", isActive ? "text-blue-900" : "text-slate-900 group-hover:text-blue-700")}>
          {deal.name}
        </div>
      </div>
      <div className={cn("text-[10px] mt-0.5", isActive ? "text-blue-700" : "text-slate-500")}>
        {deal.stage} • {deal.kpi}
      </div>
      
      {/* AI Deal Score Badge */}
      <div className={cn(
        "absolute right-2 top-2 px-1.5 py-0.5 text-[9px] font-bold rounded flex items-center gap-1 border",
        scoreColor
      )} title={`AI Deal Score: ${score}/100`}>
        {score}
      </div>
    </div>
  );
}
