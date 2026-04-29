import { mockDeals, mockTasks } from '../data/mock';
import { X, ExternalLink, FileText, Activity, Users, Clock, Check, Plus, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { generateProactiveInsights } from '../lib/scoring';

export function DealDeepDive({ dealId, onClose }: { dealId: string; onClose: () => void }) {
  const deal = mockDeals.find(d => d.id === dealId);
  if (!deal) return null;

  const dealTasks = mockTasks.filter(t => t.dealId === deal.id);

  const stages = ['Sourcing', 'Due Diligence', 'Execution', 'Portfolio'];
  const currentStageIdx = stages.indexOf(deal.stage);
  
  // Find insights specifically for this deal
  const allInsights = generateProactiveInsights([deal]);
  const dealInsight = allInsights.length > 0 ? allInsights[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 bg-white z-20 flex flex-col m-6 rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
    >
      <header className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
             {deal.name.substring(0, 1)}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{deal.name} <span className="text-slate-400 font-normal ml-2">{deal.kpi}</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-white border border-slate-200 font-semibold text-xs text-slate-700 rounded-md hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors">
            <ExternalLink size={14} /> Open CRM
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-white">
        
        {/* Smart Assistant Banner */}
        {dealInsight && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-blue-50/80 to-indigo-50/30 border border-blue-100 rounded-xl p-4 flex items-start gap-4 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={14} />
            </div>
            <div className="flex-1">
               <h4 className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-2">
                 AI Strategic Recommendation
                 <span className="bg-blue-200 text-blue-800 text-[9px] px-1.5 rounded-sm">High Confidence</span>
               </h4>
               <p className="text-sm text-blue-800/80 leading-relaxed max-w-3xl">
                 {dealInsight.description}
               </p>
               <div className="mt-4 flex gap-2">
                 <button className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded shadow-sm hover:bg-blue-700 transition-colors">
                   {dealInsight.action}
                 </button>
                 <button className="px-4 py-1.5 bg-white border border-blue-200 text-blue-700 text-[11px] font-bold rounded shadow-sm hover:bg-blue-50 transition-colors">
                   Draft Email
                 </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* Stage Progression Box */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Stage Progression</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
                style={{ width: `${(currentStageIdx / (stages.length - 1)) * 100}%` }}
              />
              
              {stages.map((stage, idx) => {
                const isPast = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-colors",
                      isPast ? "bg-blue-600 text-white" : isCurrent ? "bg-white border-2 border-blue-600 text-blue-600 scale-125" : "bg-white border-2 border-slate-300 text-slate-400"
                    )}>
                      {isPast ? <Check size={12} strokeWidth={3} /> : (idx + 1)}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      isPast ? "text-blue-700" : isCurrent ? "text-slate-900" : "text-slate-400"
                    )}>
                      {stage}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="col-span-2 space-y-6">
            
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} /> Deal Action Items
                </h3>
                <button className="text-[10px] text-blue-600 font-semibold hover:underline bg-blue-50 px-2 py-1 rounded">Generate Tasks</button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100">
                {dealTasks.length > 0 ? dealTasks.map(task => (
                  <div key={task.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors group">
                    <div className="mt-0.5 w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0 group-hover:border-blue-500 transition-colors cursor-pointer" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="text-[13px] font-semibold text-slate-900">{task.title}</div>
                        {task.risk === 'critical' && <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Blocker</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1 font-medium"><Clock size={10} /> {task.dueDate}</span>
                        <span className="text-slate-300">•</span>
                        <span>{task.owner}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Check size={18} />
                    </div>
                    <p className="text-slate-500 text-xs mb-3">No active tasks for this deal.</p>
                    <button className="text-[11px] font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50">Add First Task</button>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Side Info Column */}
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={14} /> Documents
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1">
                <div className="p-2 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-800">IC Memo v2.pdf</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Updated 4h ago by Mike D.</div>
                  </div>
                </div>
                <div className="p-2 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-800">Financial Model.xlsx</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Updated yesterday</div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Users size={14} /> Deal Team
              </h3>
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-2">
                {['SJ', 'MD', 'AW'].map((initials, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm relative z-10 hover:z-20 hover:-translate-y-1 transition-transform cursor-pointer">
                    {initials}
                  </div>
                ))}
                <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 -ml-2 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-blue-600 z-0 relative">
                  <Plus size={12} />
                </button>
              </div>
            </section>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
