const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('rightPanelQuery')) {
  code = code.replace(
    "const [deals, setDeals] = useState(INITIAL_DEALS);\n",
    "const [deals, setDeals] = useState(INITIAL_DEALS);\n  const [cardStatuses, setCardStatuses] = useState<Record<string, string>>({});\n  const [expandedCard, setExpandedCard] = useState<string | null>(null);\n  const [rightPanelQuery, setRightPanelQuery] = useState('');\n  const [rightPanelOutput, setRightPanelOutput] = useState<any>(null);\n"
  );
}

code = code.replace(
  "                                <button style={{ background: 'transparent', border: `1px solid ${task.contextColor}`, color: task.contextColor, padding: '4px 10px', fontSize: '9px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>\n                                  {task.taskType === 'DOCUMENT_REVIEW' ? 'REVIEW DOC' : task.taskType === 'APPROVAL' ? 'APPROVE' : task.taskType === 'FOLLOW_UP' ? 'SEND MESSAGE' : 'UPDATE'}\n                                </button>",
  `                                <button onClick={(e) => {
                                      e.stopPropagation();
                                      if (task.taskType === 'APPROVAL') {
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'DONE' }));
                                        setToast({ type: 'success', message: \`\${task.title} approved \u00B7 Logged at \${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}\` });
                                      } else if (task.taskType === 'DOCUMENT_REVIEW') {
                                        setExpandedCard(expandedCard === task.id ? null : task.id);
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'info', message: \`Opening \${task.docName || 'document'} \u00B7 Review mode active\` });
                                      } else if (task.taskType === 'FOLLOW_UP') {
                                        setExpandedCard(expandedCard === task.id ? null : task.id);
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'info', message: \`Draft ready \u00B7 \${task.context} \u00B7 Review before sending\` });
                                      } else if (task.taskType === 'VENDOR_CHASE') {
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'success', message: \`Chase sent to \${task.owner} \u00B7 Response requested by EOD\` });
                                      } else if (task.taskType === 'BLOCKER') {
                                        setSlidePanel({ type: 'REASSIGN', data: { taskTitle: task.title, ownerName: task.owner, context: 'Escalation' } });
                                      }
                                    }} style={{ background: 'transparent', border: \`1px solid \${task.contextColor}\`, color: task.contextColor, padding: '4px 10px', fontSize: '9px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>
                                  {task.taskType === 'DOCUMENT_REVIEW' ? 'REVIEW DOC' : task.taskType === 'APPROVAL' ? 'APPROVE' : task.taskType === 'FOLLOW_UP' ? 'SEND MESSAGE' : task.taskType === 'VENDOR_CHASE' ? 'CHASE' : task.taskType === 'BLOCKER' ? 'ESCALATE' : 'UPDATE'}
                                </button>`
);

code = code.replace(
  "<div style={{ width: '52px', height: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 'auto', borderLeft: '2px solid transparent' }}>\n             <svg width=\"13\" height=\"13\"",
  "<div onClick={() => setToast({ type: 'info', message: 'Settings panel coming in next release' })} style={{ width: '52px', height: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 'auto', borderLeft: '2px solid transparent' }}>\n             <svg width=\"13\" height=\"13\""
);

code = code.replaceAll(
  "<button style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>COPY</button>",
  `<button onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(t.draftCopy || ''); } setToast({ type: 'success', message: 'Draft copied to clipboard' }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>COPY</button>`
);

code = code.replace(
  "<button style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>REQUEST CHANGES</button>",
  `<button onClick={() => { setDealTasksExp(t.id); setToast({ type: 'warning', message: \`Changes requested \u00B7 \${t.owner} will be notified\` }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>REQUEST CHANGES</button>`
);

code = code.replace(
  "<button style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>DEFER</button>",
  `<button onClick={() => { setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'NOT_STARTED' } : pt)); setToast({ type: 'info', message: \`Deferred \u00B7 \${t.title} moved to tomorrow\` }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>DEFER</button>`
);

if (!code.includes("OPEN FILE") && code.includes("MARK REVIEWED ✓")) {
  code = code.replace(
    "<button onClick={() => markDone('APPROVE', 'Reviewed successfully')} style={{ background: '#2EBD85'",
    `<button onClick={() => setToast({ type: 'info', message: \`Opening \${t.docName || 'document'} in document viewer \u2197\` })} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>OPEN FILE &nearr;</button>\n                                    <button onClick={() => markDone('APPROVE', 'Reviewed successfully')} style={{ background: '#2EBD85'`
  );
}

code = code.replace(
  "<button style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>OPEN IN EXCEL &nearr;</button>",
  `<button onClick={() => setToast({ type: 'info', message: 'Opening Financial Model.xlsx in Excel \u2197' })} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>OPEN IN EXCEL &nearr;</button>`
);

const oldInput = `<input \n                     type="text" \n                     className="mono" \n                     placeholder="› What's on my plate today that I should prioritise first?" \n                     style={{ background: 'transparent', border: 'none', outline: 'none', color: COLORS.textPrimary, fontSize: '13px', width: '100%' }}\n                   />`;

const newInput = `<input 
                     type="text" 
                     className="mono" 
                     value={rightPanelQuery}
                     onChange={(e) => setRightPanelQuery(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && rightPanelQuery.trim()) {
                            const q = rightPanelQuery.trim().toLowerCase();
                            let response = '';
                            if (q.includes('risk')) {
                                response = 'Highest risk: Nebula SaaS counterparty silent 48h. Recommend follow-up before 11am.';
                            } else if (q.includes('prioriti') || q.includes('today')) {
                                response = 'Priority order: (1) Nebula ARR sign-off — partner meeting tomorrow. (2) Project Diamond go-live call 13:00. (3) Acme covenant — 5-day clock running.';
                            } else if (q.includes('overdue')) {
                                response = '2 overdue: Acme SPA follow-up (4 days) and RDC site validation (2 days).';
                            } else if (q.includes('nebula')) {
                                response = 'Nebula SaaS: DD stage, score 71 trending down. Counterparty unresponsive 48h. ARR model unreviewed. High stall risk.';
                            } else if (q.includes('acme')) {
                                response = 'Acme Corp: Execution stage, score 94. SPA clause 8.3 outstanding. Covenant package received — 5-day clock.';
                            } else {
                                response = 'Analysing across ' + deals.length + ' active deals. No critical blockers beyond Nebula counterparty silence. ' + q.slice(0, 40) + '...';
                            }
                            setRightPanelOutput({
                                query: rightPanelQuery,
                                response,
                                time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
                            });
                            setRightPanelQuery('');
                        }
                     }}
                     placeholder="› What's on my plate today that I should prioritise first?" 
                     style={{ background: 'transparent', border: 'none', outline: 'none', color: COLORS.textPrimary, fontSize: '13px', width: '100%' }}
                   />`;

code = code.replace(oldInput, newInput);

const addOutput = `                 </div>\n                 {rightPanelOutput && (
                    <div style={{ background: '#0D0F15', border: '1px solid #1E2028', borderRadius: '3px', padding: '10px 12px', marginTop: '8px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '12px', color: '#4A4D61', cursor: 'pointer', padding: '0 2px' }} onClick={() => setRightPanelOutput(null)} onMouseEnter={(e) => e.currentTarget.style.color = '#E8EAF0'} onMouseLeave={(e) => e.currentTarget.style.color = '#4A4D61'}>×</div>
                        <div className="mono" style={{ fontSize: '9px', color: '#4A4D61', marginBottom: '5px' }}>› {rightPanelOutput.query.length > 35 ? rightPanelOutput.query.slice(0,35) + '...' : rightPanelOutput.query}</div>
                        <div style={{ fontSize: '11px', color: '#E8EAF0', lineHeight: 1.5 }}>{rightPanelOutput.response}</div>
                        <div className="mono" style={{ fontSize: '9px', color: '#4A4D61', marginTop: '4px' }}>{rightPanelOutput.time}</div>
                    </div>
                 )}\n                 <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>`;

code = code.replace(`                 </div>\n                 <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>`, addOutput);

fs.writeFileSync('src/App.tsx', code);
console.log('Replacements executed');
