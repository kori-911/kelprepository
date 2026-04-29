import { Zap, Calendar as CalendarIcon, MoreVertical, Plus, Info } from 'lucide-react';
import { mockCalendar, mockDeals, CalendarBlock, Insight } from '../data/mock';
import { generateProactiveInsights } from '../lib/scoring';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function IntelligencePanel() {
  const dynamicInsights = generateProactiveInsights(mockDeals);

  return (
    <aside className="w-[300px] h-full border-l border-slate-200 bg-white flex flex-col flex-shrink-0 z-10 hidden xl:flex">
      {/* AI Insights Section */}
      <div className="p-5 border-b border-slate-100 bg-blue-50/50 flex-shrink-0 relative overflow-hidden">
        {/* Subtle background pulse to indicate AI activity */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl pointer-events-none" 
        />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
              className="text-blue-600"
            >
              <Zap size={14} className="fill-blue-600" />
            </motion.span>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">AI Insight Engine</h3>
          </div>
          <button className="text-slate-400 hover:text-blue-600 transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>
        <div className="space-y-3 relative z-10">
           <AnimatePresence>
             {dynamicInsights.map((insight, idx) => (
               <InsightCard key={insight.id || idx} insight={insight} />
             ))}
           </AnimatePresence>
        </div>
      </div>

      {/* Smart Calendar Section */}
      <div className="p-5 flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Intelligence</h3>
          <button className="text-slate-400 hover:text-blue-600 transition-colors">
            <CalendarIcon size={14} />
          </button>
        </div>
        
        <div className="flex-1 space-y-4">
          {mockCalendar.map((block, idx) => (
            <TimeBlock key={block.id} block={block} index={idx} />
          ))}
          
          <div className="mt-8">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Suggested Time Blocks</div>
            <motion.div 
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="p-2 border border-dashed border-blue-300 bg-blue-50/30 rounded text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all"
            >
              <div className="text-xs font-medium text-blue-800">Deep Work: IC Memo Review</div>
              <div className="text-[10px] text-blue-600/70 mt-1">14:00 - 15:30 (Auto-Schedule)</div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
          <button className="flex items-center justify-center p-2 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors gap-1">
            <Plus size={12} strokeWidth={3} />
            <span className="text-[10px] font-bold">DEAL</span>
          </button>
          <button className="flex items-center justify-center p-2 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors gap-1">
            <Plus size={12} strokeWidth={3} />
            <span className="text-[10px] font-bold">TASK</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function TimeBlock({ block, index }: { block: CalendarBlock; index: number }) {
  const isUrgent = index === 1; // Mock urgent state for the demo
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <motion.div 
      layout
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileHover={{ scale: 1.02, x: 2 }}
      className={cn(
        "relative pl-4 border-l-2 py-1 cursor-grab active:cursor-grabbing",
        isUrgent ? "border-blue-500 bg-blue-50 py-2 rounded-r shadow-sm" : "border-slate-200 hover:bg-slate-50 rounded-r transition-colors",
        isDragging ? "shadow-lg bg-white ring-1 ring-slate-200 opacity-90" : ""
      )}
    >
      <div className={cn(
        "absolute -left-[5px] w-2 h-2 rounded-full",
        isUrgent ? "bg-blue-500 top-3 ring-4 ring-blue-50" : "bg-slate-400 top-2"
      )}></div>
      <div className={cn(
        "text-[11px] font-bold uppercase",
        isUrgent ? "text-blue-600" : "text-slate-400"
      )}>
        {block.time} — {block.duration}
      </div>
      <div className="text-xs font-semibold mt-1 text-slate-900 leading-tight pr-2">
        {block.title}
      </div>
      <div className={cn(
        "text-[10px] mt-1",
        isUrgent ? "text-blue-400 italic font-medium" : "text-slate-500"
      )}>
        {block.type === 'meeting' ? 'Conference / Zoom' : 'Deep Work'}
      </div>
    </motion.div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white border rounded-lg p-3 shadow-sm cursor-pointer transition-colors",
        isExpanded ? "border-blue-400 ring-1 ring-blue-400" : "border-blue-100 hover:border-blue-300"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex gap-2">
        <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-relaxed text-slate-700">
          <span className="font-bold text-blue-800">{insight.title}:</span> {insight.description}
        </p>
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
            <div className="mt-3 bg-blue-50/50 p-2 rounded text-[11px] text-slate-600 border border-blue-100/50">
              <span className="font-semibold text-slate-700 block mb-1">Why this matters:</span>
              Based on historical data, deals stalling in this stage for &gt;5 days have a 40% higher chance of slipping to next quarter.
            </div>
            <div className="mt-3 flex justify-end">
              <button 
                className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded shadow-sm hover:bg-blue-700 transition-colors w-full relative overflow-hidden group"
                onClick={(e) => {
                  e.stopPropagation();
                  // action execution
                  setIsExpanded(false);
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
                Execute: {insight.action}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Auto-generated</span>
          <button className="text-[10px] font-bold text-blue-600 uppercase hover:text-blue-800 transition-colors">
            {insight.action}
          </button>
        </div>
      )}
    </motion.div>
  );
}
