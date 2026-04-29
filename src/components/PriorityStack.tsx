import { Filter, ChevronDown, Check, Clock, AlertCircle, MessageSquare, MoreHorizontal, Sparkles, Send } from 'lucide-react';
import { mockTasks, mockDeals, Task } from '../data/mock';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { calculateDealScore } from '../lib/scoring';
import { motion, AnimatePresence } from 'motion/react';

export function PriorityStack() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleComplete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Sort tasks within their type buckets based on the AI Deal Score 
  const sortTasksByDealRisk = (tasksToSort: Task[]) => {
    return tasksToSort.sort((a, b) => {
      const dealA = mockDeals.find(d => d.id === a.dealId);
      const dealB = mockDeals.find(d => d.id === b.dealId);
      const scoreA = dealA ? calculateDealScore(dealA) : 50;
      const scoreB = dealB ? calculateDealScore(dealB) : 50;
      return scoreA - scoreB; // Lower score first
    });
  };

  const urgentTasks = sortTasksByDealRisk(tasks.filter(t => t.type === 'urgent'));
  const atRiskTasks = sortTasksByDealRisk(tasks.filter(t => t.type === 'at-risk'));
  const upcomingTasks = sortTasksByDealRisk(tasks.filter(t => t.type === 'upcoming'));

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50 w-full overflow-hidden">
      <header className="px-6 pt-6 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Deal OS <span className="text-slate-400 font-normal">/ Active Execution</span></h1>
          <div className="flex items-center space-x-2">
            <div className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
              <Sparkles size={10} /> Smart Priority Active
            </div>
            <button className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-700 text-xs shadow-sm bg-slate-50">
              <Filter size={14} />
            </button>
          </div>
        </div>
        
        {/* AI Command Layer */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Sparkles size={16} className="text-blue-500" />
          </div>
          <input 
            type="text" 
            placeholder="Ask AI: 'Show deals at risk' or 'Schedule my pending tasks'..." 
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm group-hover:border-slate-300 text-slate-700 placeholder:text-slate-400 font-medium"
          />
          <button className="absolute inset-y-1.5 right-1.5 w-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors">
            <Send size={14} />
          </button>
        </div>
      </header>
      
      <div className="px-6 py-4 space-y-6 flex-1 overflow-y-auto">
        <TaskSection title="Immediate Attention" subtitle="Auto-prioritized by risk level" tasks={urgentTasks} onComplete={handleComplete} />
        <TaskSection title="At Risk" subtitle="Pattern detected: Delayed communication" tasks={atRiskTasks} onComplete={handleComplete} />
        <TaskSection title="Upcoming" subtitle="Planned workload" tasks={upcomingTasks} onComplete={handleComplete} />
      </div>
    </div>
  );
}

function TaskSection({ title, subtitle, tasks, onComplete }: { title: string; subtitle?: string; tasks: Task[]; onComplete: (id: string) => void }) {
  if (!tasks.length) return null;
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          {title}
          {subtitle && <span className="text-[11px] font-medium text-slate-500 ml-2 py-0.5 px-1.5 bg-slate-200/50 rounded">{subtitle}</span>}
        </h3>
        <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
          View All {tasks.length}
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <PriorityCard key={task.id} task={task} onComplete={onComplete} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PriorityCard({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const riskColors: Record<string, string> = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    normal: 'bg-slate-300'
  };
  
  const riskTextColors: Record<string, string> = {
    critical: 'text-red-700',
    warning: 'text-amber-700',
    success: 'text-emerald-700',
    normal: 'text-slate-500'
  };
  
  const riskLabels: Record<string, string> = {
    critical: 'Critical Action Required',
    warning: 'Slippage Risk Detected',
    success: 'On Track',
    normal: 'Note'
  };

  const aiReasoning: Record<string, string> = {
    critical: 'Because this deal hasn’t been updated in 5 days and is moving slower than average.',
    warning: 'Counterparty response times have doubled recently.',
    success: 'Engagement is consistent.',
    normal: 'Standard task timeline.'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={cn(
        "bg-white border rounded-lg p-3 shadow-sm transition-all cursor-pointer group",
        isExpanded ? "border-blue-400 ring-2 ring-blue-100 shadow-md" : "border-slate-200 hover:border-slate-300"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 w-full">
          <div className={cn("w-1 h-10 rounded-full mt-1.5", riskColors[task.risk])}></div>
          <div className="flex-1 min-w-0">
            <div className={cn("text-[10px] font-bold uppercase mb-0.5 flex justify-between", riskTextColors[task.risk])}>
              <span className="flex items-center gap-1.5">
                {task.risk === 'critical' && <Sparkles size={10} className="text-red-600" />}
                {task.risk === 'warning' && <Sparkles size={10} className="text-amber-600" />}
                {riskLabels[task.risk] || task.risk} • {task.dealName}
              </span>
              {isExpanded && (
                 <button className="text-slate-400 hover:text-slate-600">
                   <MoreHorizontal size={14} />
                 </button>
              )}
            </div>
            <div className={cn("text-sm font-semibold transition-colors", isExpanded ? "text-blue-900" : "text-slate-800")}>
              {task.title}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 font-medium"><Clock size={10} /> {task.dueDate}</span>
              <span className="text-slate-300">•</span>
              <span>Owner: {task.owner}</span>
            </div>
          </div>
        </div>
        
        {!isExpanded && (
          <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
            {task.risk === 'critical' ? (
              <button className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
                Resolve
              </button>
            ) : (
              <button className="px-3 py-1 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-semibold rounded hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm">
                Open
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100">
              
              {/* AI Explanation Snippet */}
              <div className="mb-4 text-[11px] text-slate-600 bg-slate-50/80 rounded p-2 border border-slate-100 flex items-start gap-2">
                 <Sparkles size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                 <span><span className="font-bold text-slate-700">AI Priority Reasoning:</span> {aiReasoning[task.risk]}</span>
              </div>

              <div className="bg-slate-50 rounded p-3 mb-4 flex items-start gap-3 border border-slate-100 shadow-inner">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-slate-500">SJ</div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-xs font-semibold text-slate-700">Sarah Jenkins</span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">I updated the financials based on the latest data. Needs review before the partner meeting tomorrow.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task.id);
                  }}
                >
                  <Check size={12} strokeWidth={3} /> Mark Complete
                </button>
                <button 
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded hover:bg-slate-50 transition-colors shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Auto-Schedule Time
                </button>
                <div className="flex-1 min-w-[20px]"></div>
                <button 
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-[11px] font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare size={12} /> Reply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
