import * as fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startMarker = `                    {/* 1. DECISION REQUIRED */}`;
const endMarker = `                )}

                {currentMode === 'PORTFOLIO' && (`;

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find markers.", startIdx, endIdx);
  process.exit(1);
}

const replacement = `                    {/* 1. TODAY */}
                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <span style={{ fontSize: '9px', color: '#4A4D61', textTransform: 'uppercase' }}>TODAY</span>
                        <span className="mono" style={{ fontSize: '9px', color: '#4A4D61' }}>25 Apr &middot; {todayTasks.length} tasks</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {todayTasks.length === 0 ? (
                          <div className="mono" style={{ padding: '14px', textAlign: 'center', fontSize: '11px', color: '#4A4D61' }}>Nothing here &middot; You're clear</div>
                        ) : todayTasks.map(task => (
                          <div key={task.id} style={{ display: 'flex', width: '100%' }}>
                            <div className="mono" style={{ width: '40px', flexShrink: 0, textAlign: 'right', paddingRight: '12px', fontSize: '10px', color: '#4A4D61', paddingTop: '14px' }}>
                              {task.time}
                            </div>
                            <div style={{ flex: 1, background: '#111318', borderLeft: \`3px solid \${task.cardBorderColor}\`, borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '9px', textTransform: 'uppercase', border: \`1px solid \${task.contextColor}\`, color: task.contextColor, borderRadius: '3px', padding: '2px 6px' }}>{task.context}</span>
                                  <span style={{ fontSize: '9px', textTransform: 'uppercase', border: \`1px solid \${task.status === 'DONE' ? '#2EBD85' : task.status === 'IN_PROGRESS' ? '#E8943A' : '#4A4D61'}\`, color: task.status === 'DONE' ? '#2EBD85' : task.status === 'IN_PROGRESS' ? '#E8943A' : '#4A4D61', borderRadius: '3px', padding: '2px 6px' }}>{task.status.replace('_', ' ')}</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0', marginBottom: '6px' }}>{task.title}</div>
                                <div className="mono" style={{ fontSize: '11px', color: '#4A4D61' }}>Owner: {task.owner} &middot; {task.deadline}</div>
                              </div>
                              <div style={{ borderTop: '1px solid #1E2028', background: '#0D0F15', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
                                <span className="mono" style={{ fontSize: '11px', color: '#8B8FA8' }}>{task.signalSource || task.signal}</span>
                                <button style={{ background: 'transparent', border: \`1px solid \${task.contextColor}\`, color: task.contextColor, padding: '4px 10px', fontSize: '9px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>
                                  {task.taskType === 'DOCUMENT_REVIEW' ? 'REVIEW DOC' : task.taskType === 'APPROVAL' ? 'APPROVE' : task.taskType === 'FOLLOW_UP' ? 'SEND MESSAGE' : 'UPDATE'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 2. NEW REQUESTS */}
                    <section style={{ marginTop: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', color: '#4A4D61', textTransform: 'uppercase' }}>NEW REQUESTS</span>
                          <span className="mono" style={{ fontSize: '9px', color: '#4A4D61', marginLeft: '8px' }}>Assigned to you &middot; Pending acceptance</span>
                        </div>
                        <span className="mono" style={{ fontSize: '9px', color: '#E8943A' }}>{newRequests.length} pending</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {newRequests.length === 0 ? (
                          <div className="mono" style={{ padding: '14px', textAlign: 'center', fontSize: '11px', color: '#4A4D61' }}>Nothing here &middot; You're clear</div>
                        ) : newRequests.map(req => (
                          <div key={req.id} style={{ display: 'flex', width: '100%', transition: 'all 300ms' }}>
                            <div style={{ width: '40px', flexShrink: 0 }}></div>
                            <div style={{ flex: 1, background: '#111318', borderLeft: '3px solid #E8943A', borderRadius: '4px', padding: '12px 14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '9px', textTransform: 'uppercase', border: \`1px solid \${req.contextColor}\`, color: req.contextColor, borderRadius: '3px', padding: '2px 6px' }}>{req.context}</span>
                                <span className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>Assigned by {req.assignedBy} &middot; {req.assignedAgo}</span>
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0', marginBottom: '6px' }}>{req.title}</div>
                              <div className="mono" style={{ fontSize: '11px', color: '#8B8FA8', marginBottom: req.note ? '12px' : '16px' }}>Requested deadline: {req.deadline}</div>
                              
                              {req.note && (
                                <div style={{ background: '#0D0F15', borderLeft: '2px solid #262933', padding: '8px 10px', fontSize: '11px', color: '#8B8FA8', marginBottom: '16px' }}>
                                  {req.note}
                                </div>
                              )}
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button 
                                  onClick={() => {
                                    const newTask = {
                                      id: 't' + Date.now(),
                                      time: "—",
                                      context: req.context,
                                      contextColor: req.contextColor,
                                      cardBorderColor: req.contextColor,
                                      title: req.title,
                                      owner: "Myself",
                                      deadline: req.deadline,
                                      status: "NOT_STARTED",
                                      taskType: "APPROVAL",
                                      signal: req.note || "Task accepted from queue",
                                      signalSource: \`Assigned by \${req.assignedBy} \`
                                    };
                                    setTodayTasks([...todayTasks, newTask]);
                                    setNewRequests(newRequests.filter(r => r.id !== req.id));
                                    setToast({ type: 'success', message: 'Task accepted · Added to today\\'s work' });
                                  }}
                                  style={{ background: '#2EBD85', color: '#080A0F', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}
                                >
                                  ACCEPT
                                </button>
                                <button 
                                  onClick={() => {
                                    setSlidePanel({ type: 'REASSIGN', data: { cardId: req.id } });
                                  }}
                                  style={{ background: 'transparent', color: '#8B8FA8', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}
                                >
                                  REASSIGN
                                </button>
                                <button 
                                  onClick={() => {
                                    setBacklogTasks([{ id: 'b' + Date.now(), context: req.context, title: req.title }, ...backlogTasks]);
                                    setBacklogCount(c => c + 1);
                                    setNewRequests(newRequests.filter(r => r.id !== req.id));
                                    setToast({ type: 'info', message: 'Task deferred · Added to backlog' });
                                  }}
                                  style={{ background: 'transparent', color: '#4A4D61', border: 'none', padding: '6px 14px', fontSize: '10px', cursor: 'pointer' }}
                                >
                                  Defer to later &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 3. BACKLOG */}
                    <section style={{ marginTop: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <span style={{ fontSize: '9px', color: '#4A4D61', textTransform: 'uppercase' }}>BACKLOG</span>
                        <span className="mono" style={{ fontSize: '9px', color: '#4A4D61' }}>{backlogCount} tasks</span>
                      </div>
                      
                      <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: '40px', flexShrink: 0 }}></div>
                        <div style={{ flex: 1 }}>
                          <div 
                            onClick={() => setBacklogExpanded(!backlogExpanded)}
                            style={{ background: '#0D0F15', border: '1px solid #1E2028', borderRadius: '4px', padding: '12px 14px', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{ fontSize: '12px', color: '#8B8FA8' }}>{backlogCount} unscheduled tasks across 8 projects</span>
                              <span style={{ fontSize: '10px', color: '#3D7EF8' }}>{backlogExpanded ? 'Collapse ↑' : 'Show backlog ↓'}</span>
                            </div>
                            <div className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>
                              MAXBUPA &middot; PROJECT DIAMOND &middot; KELP &middot; HOME FIRST FINANCE &middot; +4 more
                            </div>
                          </div>
                          
                          {backlogExpanded && (
                            <div style={{ border: '1px solid #1E2028', borderTop: 'none', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', overflow: 'hidden' }}>
                              {backlogTasks.slice(0, 5).map((task, idx) => (
                                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: idx < 4 ? '1px solid #1E2028' : 'none', background: '#0C0E14' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '9px', textTransform: 'uppercase', border: '1px solid #4A4D61', color: '#4A4D61', borderRadius: '3px', padding: '2px 6px' }}>{task.context}</span>
                                    <span style={{ fontSize: '12px', color: '#8B8FA8' }}>{task.title}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>Unscheduled</span>
                                    <span 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setModal({ type: 'ADD_TASK', data: { title: task.title, context: task.context, urgency: 'PLANNED' } });
                                      }}
                                      style={{ fontSize: '10px', color: '#3D7EF8', cursor: 'pointer' }}
                                    >
                                      Schedule &rarr;
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              <div className="mono" style={{ padding: '10px 14px', background: '#0C0E14', borderTop: '1px solid #1E2028', fontSize: '10px', color: '#4A4D61', textAlign: 'center' }}>
                                Showing 5 of {backlogCount} &middot; Sort by: 
                                <span style={{ color: backlogSort === 'Staleness' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Staleness'); }}>Staleness</span> / 
                                <span style={{ color: backlogSort === 'Project' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Project'); }}>Project</span> / 
                                <span style={{ color: backlogSort === 'Priority' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Priority'); }}>Priority</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
`;

const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync('src/App.tsx', newContent);
console.log("Successfully replaced.");
