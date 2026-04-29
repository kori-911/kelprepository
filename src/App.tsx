import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
const pipelineTargets = [
  {
    id: 't1',
    name: 'Meridian Healthcare',
    stage: 'PROSPECT',
    score: 82,
    direction: '↑',
    pulse: [70, 74, 77, 80, 82],
    signal: 'Warm intro available',
    docs: [],
    team: []
  },
  {
    id: 't2',
    name: 'Vantage Infrastructure',
    stage: 'PROSPECT',
    score: 54,
    direction: '→',
    pulse: [51, 53, 54, 53, 54],
    signal: 'Monitoring — no trigger yet',
    docs: [],
    team: []
  }
];

const INITIAL_DEALS = [
  {
    id: 'acme',
    name: 'Acme Corp Buyout',
    stage: 'EXECUTION',
    score: 94,
    direction: '▲',
    delta: 2,
    scoreColor: '#E03E3E',
    pulse: [82, 87, 90, 92, 94],
    signal: 'Clean trajectory',
    actions: [
      {
        id: 'acme-1',
        taskType: 'FOLLOW_UP',
        urgency: 'CRITICAL',
        title: 'Follow up on SPA terms',
        owner: 'SJ',
        ownerName: 'Sarah J.',
        deadline: 'Tomorrow',
        status: 'NOT_STARTED',
        signal: 'Counterparty counsel went quiet 4 days after receiving the amendment.',
        signalSource: 'Email thread · 4 days ago',
        draftCopy: "Hi [Name], following up on the SPA terms we shared last week — specifically the clause 8.3 amendment. Could you confirm your position before EOD today? Happy to jump on a quick call if helpful."
      },
      {
        id: 'acme-2',
        taskType: 'VENDOR_CHASE',
        urgency: 'WARNING',
        title: 'Chase diligence vendor on delays',
        owner: 'AW',
        ownerName: 'Alex W.',
        deadline: 'Today',
        status: 'NOT_STARTED',
        signal: 'Diligence vendor last responded 3 days ago. Background check on 2 directors still outstanding.',
        signalSource: 'Email thread · Detected 3h ago',
        draftCopy: "Hi [Name], checking in on the background verification for the two directors we flagged last week. We're on a tight timeline for IC submission — can you give us a status update and revised ETA today?"
      },
      {
        id: 'acme-3',
        taskType: 'DOCUMENT_REVIEW',
        urgency: 'PLANNED',
        title: 'Review lender covenant package',
        owner: 'MD',
        ownerName: 'Mike D.',
        deadline: 'Friday',
        status: 'NOT_STARTED',
        signal: 'Lender finalized covenant package. 5-day board sign-off clock starts on receipt.',
        signalSource: 'Integration: CRM · 4h ago',
        docName: 'Covenant Package v1.pdf',
        docTag: 'CURRENT',
        docColor: '#2EBD85',
        aiSummary: [
          'Covenant package covers 3 facilities totalling $180M.',
          'Interest coverage ratio set at 3.5× — tighter than comparable deals.',
          'One clause requires board sign-off within 5 business days of receipt.',
          'Legal has not yet been notified of the 5-day clock.'
        ]
      },
      {
        id: 'acme-4',
        taskType: 'DOCUMENT_REVIEW',
        urgency: 'PLANNED',
        title: 'Draft revised management rollover',
        owner: 'SJ',
        ownerName: 'Sarah J.',
        deadline: 'Next Week',
        status: 'NOT_STARTED',
        signal: 'Management rollover terms missing from latest SPA draft.',
        signalSource: 'Doc: SPA v4 · 12h ago',
        docName: 'SPA Draft v4.docx',
        docTag: 'UNREVIEWED',
        docColor: '#E8943A',
        aiSummary: [
          'Management rollover clause absent from sections 4 and 7.',
          'Previous version (v3) included a 24-month lock-up provision.',
          'Counterparty counsel has not raised this omission.',
          'Recommend reinserting v3 language as a baseline before next review.'
        ]
      },
      {
        id: 'acme-5',
        taskType: 'BLOCKER',
        urgency: 'CRITICAL',
        title: 'Finalize working capital peg',
        owner: 'MD',
        ownerName: 'Mike D.',
        deadline: 'EOD',
        status: 'NOT_STARTED',
        signal: 'Working capital peg unresolved for 3 days. Lender assumes $12.4M, management last proposed $10.8M. Gap: $1.6M.',
        signalSource: 'Financial Model · Detected 1d ago'
      },
      {
        id: 'acme-6',
        taskType: 'DOCUMENT_REVIEW',
        urgency: 'WARNING',
        title: 'Review env risk report',
        owner: 'SJ',
        ownerName: 'Sarah J.',
        deadline: 'Tomorrow',
        status: 'IN_PROGRESS',
        signal: 'Environmental risk report flagged 2 medium-severity items in site assessment.',
        signalSource: 'Doc: Env Report · 6h ago',
        docName: 'Environmental Risk Report.pdf',
        docTag: 'REFERENCED IN RISK',
        docColor: '#E03E3E',
        aiSummary: [
          '2 medium-severity items identified in Phase 1 site assessment.',
          'Both items relate to historical land use at the Midlands facility.',
          'Remediation cost estimate: £340k–£600k based on comparable cases.',
          'No legal liability confirmed yet — Phase 2 assessment recommended.'
        ]
      }
    ],
    intelligence: [
      {
        text: 'Management rollover terms missing from latest SPA draft.',
        source: 'Doc: SPA v4 · 12h ago',
        color: '#E03E3E',
        linkedTaskId: 'acme-4'
      },
      {
        text: 'Diligence vendor noted delay in background checks.',
        source: 'Email: Vendor Thread · 2h ago',
        color: '#E8943A',
        linkedTaskId: 'acme-2'
      },
      {
        text: 'Lender finalized covenant package.',
        source: 'Integration: CRM · 4h ago',
        color: '#3D7EF8',
        linkedTaskId: 'acme-3'
      }
    ],
    documents: [
      { 
        name: 'IC Memo v2.pdf', 
        color: '#E03E3E',
        tag: 'REFERENCED IN RISK',
        tagColor: '#E8943A',
        updatedBy: 'MD', updatedAgo: '2h'
      },
      { 
        name: 'Financial Model.xlsx', 
        color: '#2EBD85',
        tag: 'UNREVIEWED',
        tagColor: '#E03E3E',
        updatedBy: 'MD', updatedAgo: '2h'
      },
      { 
        name: 'Term Sheet Draft.docx', 
        color: '#3D7EF8',
        tag: 'CURRENT',
        tagColor: '#2EBD85',
        updatedBy: 'MD', updatedAgo: '2h'
      }
    ],
    team: ['SJ', 'MD', 'AW'],
    teamLastActive: ['2h ago', '1h ago', '4h ago']
  },
  {
    id: 'nebula',
    name: 'Nebula SaaS',
    stage: 'DUE DILIGENCE',
    score: 71,
    direction: '▼',
    delta: 13,
    scoreColor: '#E8943A',
    pulse: [84, 81, 78, 74, 71],
    signal: 'Counterparty silent 48h',
    actions: [
      {
        id: 'nebula-1',
        taskType: 'FOLLOW_UP',
        urgency: 'CRITICAL',
        title: 'Review and approve Nebula ARR model',
        owner: 'MD',
        ownerName: 'Mike D.',
        deadline: 'Today, EOD',
        status: 'NOT_STARTED',
        signal: 'ARR doc not touched in 3 days. Counterparty response time ↑2.4×.',
        signalSource: 'Email thread · Detected 2h ago',
        draftCopy: 'Hi [Name], following up on the ARR model we shared — specifically the updated projections for Q3 and Q4. We need your sign-off before the partner meeting tomorrow. Can you review and confirm by EOD?'
      },
      {
        id: 'nebula-2',
        taskType: 'APPROVAL',
        urgency: 'WARNING',
        title: 'Approve term sheet deviations',
        owner: 'SJ',
        ownerName: 'Sarah J.',
        deadline: 'Today',
        status: 'NOT_STARTED',
        signal: 'Legal flagged 2 standard clauses missing. Deal room activity spiked.',
        signalSource: 'Legal Review · Detected 5h ago'
      }
    ],
    intelligence: [
      {
        text: 'Nebula SaaS counterparty has not responded in 48 hours. Risk of diligence stall is elevated.',
        source: 'Email thread · Detected 2h ago',
        color: '#E03E3E',
        linkedTaskId: 'nebula-1'
      },
      {
        text: 'ARR model variance of 14% detected between management version and our working model.',
        source: 'Financial Model · Detected 6h ago',
        color: '#E8943A',
        linkedTaskId: 'nebula-1'
      }
    ],
    documents: [
      {
        name: 'ARR Model v3.xlsx',
        color: '#2EBD85',
        tag: 'UNREVIEWED',
        tagColor: '#E03E3E',
        updatedBy: 'SJ', updatedAgo: '3d'
      },
      {
        name: 'Term Sheet v2.docx',
        color: '#3D7EF8',
        tag: 'UNREVIEWED',
        tagColor: '#E03E3E',
        updatedBy: 'MD', updatedAgo: '1d'
      }
    ],
    team: ['SJ', 'MD'],
    teamLastActive: ['1h ago', '3h ago']
  },
  {
    id: 'optima',
    name: 'Optima Logistics',
    stage: 'PORTFOLIO',
    score: 48,
    direction: '▲',
    delta: 5,
    scoreColor: '#2EBD85',
    pulse: [43, 44, 45, 46, 48],
    signal: 'On track',
    actions: [
      {
        id: 'optima-1',
        taskType: 'DOCUMENT_REVIEW',
        urgency: 'WARNING',
        title: 'Validate Q1 working capital claim',
        owner: 'AW',
        ownerName: 'Alex W.',
        deadline: 'This Week',
        status: 'NOT_STARTED',
        signal: 'CFO flagged WC improvement in last update. Not yet in reporting model.',
        signalSource: 'Management Report · 1d ago',
        docName: 'Financial Model.xlsx',
        docTag: 'UNREVIEWED',
        docColor: '#E8943A',
        aiSummary: [
          'Working capital ratio improved 1.4× since last quarter.',
          'CFO attributes improvement to new supplier payment terms.',
          'Improvement not yet reflected in the LP reporting model.',
          'Recommend updating model before next investor update.'
        ]
      },
      {
        id: 'optima-2',
        taskType: 'APPROVAL',
        urgency: 'PLANNED',
        title: 'Approve Q2 board pack outline',
        owner: 'SJ',
        ownerName: 'Sarah J.',
        deadline: 'Next Week',
        status: 'NOT_STARTED',
        signal: 'Board pack due in 12 days. Outline not yet approved.',
        signalSource: 'Board Calendar · 6h ago'
      }
    ],
    intelligence: [
      {
        text: 'Optima WC ratio improved 1.4× — CFO attributes to new payment terms. Not yet in LP reporting model.',
        source: 'Management Report · 1d ago',
        color: '#3D7EF8',
        linkedTaskId: 'optima-1'
      },
      {
        text: 'Board pack circulation deadline in 12 days. EBITDA narrative section not started.',
        source: 'Board Calendar · 6h ago',
        color: '#E8943A',
        linkedTaskId: 'optima-2'
      }
    ],
    documents: [
      {
        name: 'Q1 Management Accounts.xlsx',
        color: '#2EBD85',
        tag: 'CURRENT',
        tagColor: '#2EBD85',
        updatedBy: 'AW', updatedAgo: '1d'
      },
      {
        name: 'Board Pack Outline.docx',
        color: '#3D7EF8',
        tag: 'UNREVIEWED',
        tagColor: '#E03E3E',
        updatedBy: 'SJ', updatedAgo: '3d'
      }
    ],
    team: ['SJ', 'AW'],
    teamLastActive: ['2h ago', '30m ago']
  },
  {
    id: 'titan',
    name: 'Project Titan',
    stage: 'SOURCING',
    score: 12,
    direction: '▼',
    delta: 8,
    scoreColor: '#2EBD85',
    pulse: [20, 18, 16, 14, 12],
    signal: 'Doc gap detected',
    actions: [
      {
        id: 'titan-1',
        taskType: 'VENDOR_CHASE',
        urgency: 'CRITICAL',
        title: 'Resolve data room document gap',
        owner: 'AW',
        ownerName: 'Alex W.',
        deadline: 'Today',
        status: 'NOT_STARTED',
        signal: '3 documents requested, not submitted. Seller login frequency dropped 40% this week.',
        signalSource: 'Data Room Activity · 1d ago',
        draftCopy: "Hi [Name], we're still missing the three documents requested last week — the audited accounts, org chart, and management contracts. Our IC timeline requires these by EOD today. Can you confirm when we can expect them?"
      }
    ],
    intelligence: [
      {
        text: 'Seller data room logins dropped 40% this week. Engagement risk is elevated.',
        source: 'Data Room Activity · 1d ago',
        color: '#E03E3E',
        linkedTaskId: 'titan-1'
      },
      {
        text: 'Project Titan revenue model does not align with Q3 actuals. Variance is 14%.',
        source: 'Financial Model · Detected 4h ago',
        color: '#E8943A',
        linkedTaskId: null
      }
    ],
    documents: [
      {
        name: 'CIM Draft.pdf',
        color: '#E03E3E',
        tag: 'UNREVIEWED',
        tagColor: '#E03E3E',
        updatedBy: 'AW', updatedAgo: '4d'
      }
    ],
    team: ['AW'],
    teamLastActive: ['2h ago']
  }
];

const COLORS = {
  bg: '#080A0F',
  rail: '#0C0E14',
  surface: '#111318',
  surfaceElevated: '#181B22',
  borderSubtle: '#1E2028',
  borderDefault: '#262933',
  textPrimary: '#E8EAF0',
  textSecondary: '#8B8FA8',
  textMuted: '#4A4D61',
  blue: '#3D7EF8',
  red: '#E03E3E',
  amber: '#E8943A',
  green: '#2EBD85',
  purple: '#8B7CF6',
  mono: '#5B9CF6'
};

const getScoreColor = (score: number) => {
  if (score >= 80) return COLORS.red;
  if (score >= 50) return COLORS.amber;
  return COLORS.green;
};

// --- CSS INJECTION ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background-color: ${COLORS.bg};
    color: ${COLORS.textPrimary};
    overflow: hidden;
  }
  .mono {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }
  
  /* Scrollbar hiding for clean look */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  @keyframes pulse-red {
    0% { border-left-color: rgba(224, 62, 62, 0.4); }
    50% { border-left-color: rgba(224, 62, 62, 1); }
    100% { border-left-color: rgba(224, 62, 62, 0.4); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  @keyframes slideInRight {
    from { transform: translateX(320px); }
    to { transform: translateX(0); }
  }

  @keyframes scaleIn {
    from { transform: scale(0.96); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes fadeOut {
    0% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes fadeInScheduled {
    0% { opacity: 0; transform: translateY(4px); border-left-color: #2EBD85; }
    20% { opacity: 1; transform: translateY(0); border-left-color: #2EBD85; }
    80% { border-left-color: #2EBD85; }
    100% { border-left-color: transparent; }
  }

  .card-default {
    background: ${COLORS.surface};
    border-radius: 4px;
    transition: background 0.15s ease, border-left-color 0.15s ease;
    cursor: pointer;
  }
  .card-default:hover {
    background: ${COLORS.surfaceElevated};
  }
  .card-expanded {
    background: ${COLORS.surfaceElevated};
  }
  .pulse-border {
    animation: pulse-red 1.8s ease-in-out infinite;
  }
  .rail-item:hover {
    background: #111318;
    cursor: pointer;
  }
`;

function SlidePanelContent({ slidePanel, setSlidePanel, setToast, setDec1Owner, setDismissedCards, setAddedMembers, addedMembers }: any) {
  const close = () => setSlidePanel(null);

  if (slidePanel.type === 'REASSIGN') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Reassign Decision</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ background: '#0D0F15', padding: '12px', borderRadius: '3px', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: '#E8EAF0', marginBottom: '4px' }}>Review and approve Nebula ARR model</div>
            <div className="mono" style={{ fontSize: '11px', color: '#4A4D61' }}>Currently: Mike D.</div>
          </div>
          
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '8px' }}>SELECT TEAM MEMBER</div>
          
          {[
            { initials: 'SJ', name: 'Sarah Jenkins', role: 'Vice President', time: '4m ago' },
            { initials: 'MD', name: 'Mike Davis', role: 'Senior Associate', time: '12m ago' },
            { initials: 'AW', name: 'Alex Wong', role: 'Associate', time: '1h ago' },
            { initials: 'RK', name: 'Raj Kumar', role: 'Analyst', time: '3h ago' }
          ].map((m) => (
            <div key={m.initials} onClick={(e) => {
              // Update all to not selected except this one.
              // Just a quick hack for visual selection:
              e.currentTarget.parentElement?.querySelectorAll('.sel-member').forEach(el => {
                (el as HTMLElement).style.borderLeft = 'none';
                (el.querySelector('.sel-name') as HTMLElement).style.color = '#E8EAF0';
              });
              e.currentTarget.style.borderLeft = '2px solid #3D7EF8';
              (e.currentTarget.querySelector('.sel-name') as HTMLElement).style.color = '#3D7EF8';
              e.currentTarget.setAttribute('data-selected-name', m.name);
            }} className="sel-member" style={{ padding: '10px 0', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#111318'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
               <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#262933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#E8EAF0' }}>{m.initials}</div>
               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <div className="sel-name" style={{ fontSize: '13px', color: '#E8EAF0' }}>{m.name}</div>
                 <div style={{ fontSize: '11px', color: '#4A4D61' }}>{m.role}</div>
               </div>
               <div className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>Last active: {m.time}</div>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '8px' }}>ADD NOTE (OPTIONAL)</div>
            <textarea placeholder="Reason for reassignment..." style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', borderRadius: '3px', padding: '8px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'JetBrains Mono, monospace', outline: 'none', resize: 'vertical' }} rows={3}></textarea>
          </div>
        </div>
        <div style={{ height: '48px', borderTop: '1px solid #1E2028', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
           <button onClick={() => {
              // Find selected
              const wrap = document.querySelector('.sel-member[style*="border-left"]');
              const selName = wrap ? wrap.getAttribute('data-selected-name') : 'Sarah Jenkins';
              setDec1Owner(selName);
              setToast({ type: 'success', message: `Reassigned to ${selName} · They'll be notified immediately` });
              close();
           }} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>REASSIGN</button>
           <button onClick={close} style={{ background: 'transparent', color: '#8B8FA8', border: '1px solid #262933', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>CANCEL</button>
        </div>
      </>
    );
  }

  if (slidePanel.type === 'SET_THRESHOLD') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Configure Alert Threshold</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', color: '#8B8FA8', marginBottom: '24px' }}>Dataroom activity dropping off &middot; {slidePanel.data?.dealName || 'Deal'}</div>
          
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '8px' }}>ALERT ME WHEN</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
            {[
              { t: 'Activity drops below 30%', s: 'Current: 40% w/w · Would trigger at 30%' },
              { t: 'Activity drops below 20%', s: 'Higher risk threshold · Fewer interruptions' },
              { t: 'Any further decline detected', s: 'Maximum sensitivity · Immediate notification' }
            ].map((opt, i) => (
               <div key={i} onClick={(e) => {
                 e.currentTarget.parentElement?.querySelectorAll('.th-opt').forEach(el => {
                   (el as HTMLElement).style.border = '1px solid #1E2028';
                   (el as HTMLElement).style.borderLeft = '1px solid #1E2028';
                 });
                 e.currentTarget.style.border = '1px solid #3D7EF8';
                 e.currentTarget.style.borderLeft = '2px solid #3D7EF8';
                 e.currentTarget.setAttribute('data-val', '30');
               }} className="th-opt" style={{ padding: '10px', border: i===0?'1px solid #3D7EF8':'1px solid #1E2028', borderLeft: i===0?'2px solid #3D7EF8':'1px solid #1E2028', borderRadius: '3px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '13px', color: '#E8EAF0', marginBottom: '4px' }}>{opt.t}</div>
                  <div className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>{opt.s}</div>
               </div>
            ))}
          </div>

          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '8px' }}>NOTIFY VIA</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['EMAIL', 'SLACK', 'IN-APP'].map(v => (
              <div key={v} onClick={(e) => {
                 const el = e.currentTarget;
                 if (el.style.background === 'transparent') {
                   el.style.background = '#3D7EF8'; el.style.borderColor = '#3D7EF8'; el.style.color = '#fff';
                 } else {
                   el.style.background = 'transparent'; el.style.borderColor = '#262933'; el.style.color = '#8B8FA8';
                 }
              }} style={{ padding: '6px 12px', fontSize: '10px', color: v==='IN-APP'?'#fff':'#8B8FA8', background: v==='IN-APP'?'#3D7EF8':'transparent', border: v==='IN-APP'?'1px solid #3D7EF8':'1px solid #262933', borderRadius: '3px', cursor: 'pointer' }}>{v}</div>
            ))}
          </div>
        </div>
        <div style={{ height: '48px', borderTop: '1px solid #1E2028', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
           <button onClick={() => {
              setToast({ type: 'success', message: 'Threshold set · You\'ll be alerted if activity drops below 30%' });
              close();
           }} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>SAVE THRESHOLD</button>
           <button onClick={() => {
              setDismissedCards(prev => [...prev, 'monitor1']);
              setToast({ type: 'info', message: 'Signal dismissed · Won\'t surface again unless threshold is crossed' });
              close();
           }} style={{ background: 'transparent', color: '#E03E3E', border: '1px solid #E03E3E', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>DISMISS SIGNAL</button>
        </div>
      </>
    );
  }

  if (slidePanel.type === 'ADD_MEMBER') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Add to Deal Team &mdash; {slidePanel.data?.dealName || 'Deal'}</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          <input type="text" placeholder="Search by name or role..." style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', padding: '8px 12px', borderRadius: '3px', color: '#E8EAF0', fontSize: '13px', marginBottom: '24px', outline: 'none' }} />
          
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '8px' }}>AVAILABLE TO ADD</div>
          {[
            { initials: 'RK', name: 'Raj Kumar', role: 'Analyst', dept: 'Deal Team' },
            { initials: 'PT', name: 'Priya Tan', role: 'VP', dept: 'Portfolio' },
            { initials: 'JL', name: 'James Lee', role: 'Associate', dept: 'Deal Team' },
            { initials: 'ML', name: 'Maya Lin', role: 'Director', dept: 'Operations' }
          ].filter(m => !addedMembers.includes(m.name)).map(m => (
            <div key={m.initials} style={{ padding: '10px 0', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#262933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#E8EAF0' }}>{m.initials}</div>
               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                 <div style={{ fontSize: '13px', color: '#E8EAF0' }}>{m.name}</div>
                 <div style={{ fontSize: '11px', color: '#4A4D61' }}>{m.role} &middot; {m.dept}</div>
               </div>
               <div onClick={(e) => {
                  setAddedMembers([...addedMembers, m.name]);
                  setToast({ type: 'success', message: `${m.name} added to ${slidePanel.data?.dealName || 'Deal'} · They'll receive deal context immediately` });
               }} style={{ fontSize: '10px', color: '#3D7EF8', cursor: 'pointer', fontWeight: 600 }}>ADD +</div>
            </div>
          ))}

          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginTop: '24px', marginBottom: '8px' }}>CURRENT TEAM</div>
          {[
            { initials: 'SJ', name: 'Sarah Jenkins' },
            { initials: 'MD', name: 'Mike Davis' },
            { initials: 'AW', name: 'Alex Wong' }
          ].map(m => (
            <div key={m.initials} style={{ padding: '10px 0', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#262933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#E8EAF0' }}>{m.initials}</div>
               <div style={{ flex: 1, fontSize: '13px', color: '#E8EAF0' }}>{m.name}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (slidePanel.type === 'VIEW_ALL') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>{slidePanel.data.title} ({slidePanel.data.count})</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          {Array.from({ length: slidePanel.data.count }).map((_, i) => (
            <div key={i} style={{ background: '#111318', border: '1px solid #1E2028', borderRadius: '4px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ width: '120px', height: '12px', background: '#1E2028', borderRadius: '99px', marginBottom: '12px' }}></div>
              <div style={{ width: '100%', height: '8px', background: '#1E2028', borderRadius: '99px', marginBottom: '8px' }}></div>
              <div style={{ width: '80%', height: '8px', background: '#1E2028', borderRadius: '99px' }}></div>
            </div>
          ))}
          <div className="mono" style={{ fontSize: '10px', color: '#4A4D61', textAlign: 'center', marginTop: '24px' }}>End of items</div>
        </div>
      </>
    );
  }

  return null;
}

function ModalContent({ modal, setModal, setToast, deals, setDeals, selectedDeal }: any) {
  const [newDeal, setNewDeal] = useState({ companyName: '', stage: 'SOURCING', value: '', leadId: null as string | null, signal: '' });
  const [newDealError, setNewDealError] = useState('');
  const [stageOpen, setStageOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dealId: null as string | null, urgency: 'WATCH', ownerId: null as string | null, dueDate: '', signalContext: '' });
  const [titleError, setTitleError] = useState(false);
  const [dealError, setDealError] = useState(false);
  const [taskDealSelectorOpen, setTaskDealSelectorOpen] = useState(false);

  const resetNewDeal = () => setNewDeal({ companyName: '', stage: 'SOURCING', value: '', leadId: null, signal: '' });
  const resetNewTask = () => setNewTask({ title: '', dealId: null, urgency: 'WATCH', ownerId: null, dueDate: '', signalContext: '' });
  
  const close = () => {
    setModal(null);
    resetNewDeal();
    setNewDealError('');
    resetNewTask();
    setTitleError(false);
    setDealError(false);
    setStageOpen(false);
    setTaskDealSelectorOpen(false);
  };

  if (modal.type === 'DRAFT_INTRO') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0' }}>Draft Intro Email &mdash; Meridian Healthcare</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '4px' }}>AI DRAFT</div>
          <div className="mono" style={{ fontSize: '10px', color: '#4A4D61', marginBottom: '16px' }}>Generated from relationship context + deal thesis &middot; Edit before sending</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="mono" style={{ background: '#0D0F15', padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#E8EAF0' }}>Sarah Jenkins &rarr; CFO, Meridian Healthcare</div>
            <input type="text" defaultValue="Introduction: [Your Firm] × Meridian Healthcare" style={{ background: '#0D0F15', border: '1px solid #262933', padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', outline: 'none' }} />
            <textarea defaultValue="Hi [Name],&#10;&#10;I wanted to reach out as we've been following Meridian's growth in healthcare services with significant interest.&#10;&#10;Our fund focuses on [thesis] and we believe there could be a compelling alignment worth exploring. Would you be open to a brief introductory call in the coming weeks?&#10;&#10;Best regards,&#10;Sarah J." style={{ background: '#0D0F15', border: '1px solid #262933', borderRadius: '3px', padding: '12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', lineHeight: 1.6, resize: 'vertical', outline: 'none', height: '180px' }}></textarea>
            <div className="mono" style={{ fontSize: '10px', color: '#8B7CF6' }}>AI confidence in personalisation: 84%</div>
          </div>
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E2028', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={close} style={{ fontSize: '11px', color: '#4A4D61', cursor: 'pointer' }}>Discard</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setToast({ type: 'info', message: 'Draft copied to clipboard' }) }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>COPY DRAFT</button>
            <button onClick={() => { setToast({ type: 'success', message: 'Draft sent to Outlook · Intro logged against Meridian Healthcare' }); close(); }} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>SEND VIA OUTLOOK &nearr;</button>
          </div>
        </div>
      </>
    );
  }

  if (modal.type === 'ADD_DEAL') {
    const handleAddDeal = () => {
      if (!newDeal.companyName.trim()) {
        setNewDealError('Company name is required');
        document.getElementById('newDealCompanyName')?.focus();
        return;
      }
      
      const newDealItem = {
        id: newDeal.companyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: newDeal.companyName,
        stage: newDeal.stage,
        score: 0,
        direction: '▲',
        delta: 0,
        scoreColor: '#2EBD85',
        pulse: [0, 0, 0, 0, 0],
        signal: newDeal.signal || 'Monitoring — no signals yet',
        actions: [],
        intelligence: [],
        documents: [],
        team: newDeal.leadId ? [newDeal.leadId] : [],
        teamLastActive: ['Just now'],
        isNew: true
      };
      
      setDeals([newDealItem, ...deals]);
      setToast({ type: 'success', message: `${newDeal.companyName} added to Deal Vital Signs · Intelligence monitoring activated` });
      close();
    };

    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0' }}>Add New Deal</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>COMPANY NAME</div>
            <input 
              id="newDealCompanyName"
              type="text" 
              value={newDeal.companyName}
              onChange={(e) => { setNewDeal({ ...newDeal, companyName: e.target.value }); setNewDealError(''); }}
              onFocus={(e) => { e.target.style.borderColor = '#3D7EF8'; }}
              onBlur={(e) => { e.target.style.borderColor = newDealError ? '#E03E3E' : '#262933'; }}
              placeholder="e.g. Meridian Healthcare" 
              style={{ width: '100%', background: '#0D0F15', border: `1px solid ${newDealError ? '#E03E3E' : '#262933'}`, padding: '8px 12px', borderRadius: '3px', fontSize: '13px', color: '#E8EAF0', outline: 'none', transition: 'border-color 0.2s' }} 
            />
            {newDealError && <div style={{ fontSize: '10px', color: '#E03E3E', marginTop: '4px' }}>{newDealError}</div>}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>STAGE</div>
               <div onClick={() => setStageOpen(!stageOpen)} style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#E8EAF0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 {newDeal.stage} <span style={{ fontSize: '10px' }}>&darr;</span>
               </div>
               {stageOpen && (
                 <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#111318', border: '1px solid #262933', borderRadius: '3px', zIndex: 100 }}>
                   {['SOURCING', 'DUE DILIGENCE', 'EXECUTION', 'PORTFOLIO'].map(opt => (
                     <div 
                       key={opt}
                       onClick={() => { setNewDeal({ ...newDeal, stage: opt }); setStageOpen(false); }}
                       onMouseEnter={(e) => { e.currentTarget.style.background = '#181B22'; }}
                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                       style={{ padding: '8px 12px', fontSize: '12px', color: newDeal.stage === opt ? '#3D7EF8' : '#E8EAF0', cursor: 'pointer', borderLeft: newDeal.stage === opt ? '2px solid #3D7EF8' : '2px solid transparent' }}
                     >
                       {opt}
                     </div>
                   ))}
                 </div>
               )}
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>DEAL VALUE (USD)</div>
               <div style={{ position: 'relative' }}>
                 <span className="mono" style={{ position: 'absolute', left: '12px', top: '8px', fontSize: '13px', color: '#4A4D61' }}>$</span>
                 <input 
                   type="text" 
                   value={newDeal.value === '' ? '' : newDeal.value + (newDeal.value.endsWith('M') ? '' : 'M')}
                   onChange={(e) => {
                     const val = e.target.value.replace(/M$/, '').replace(/[^0-9.]/g, '');
                     setNewDeal({ ...newDeal, value: val });
                   }}
                   placeholder="0M" 
                   style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', padding: '8px 12px 8px 24px', borderRadius: '3px', fontSize: '13px', color: '#E8EAF0', outline: 'none' }} 
                 />
               </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>DEAL LEAD</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['SJ', 'MD', 'AW'].map((init) => (
                <div 
                  key={init} 
                  onClick={() => setNewDeal({ ...newDeal, leadId: newDeal.leadId === init ? null : init })}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: newDeal.leadId === init ? '#0F1825' : '#262933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: newDeal.leadId === init ? '#3D7EF8' : '#E8EAF0', cursor: 'pointer', border: newDeal.leadId === init ? '2px solid #3D7EF8' : '2px solid transparent', position: 'relative' }}
                >
                  {init}
                  {newDeal.leadId === init && (
                    <div className="mono" style={{ position: 'absolute', top: '34px', fontSize: '9px', color: '#3D7EF8', whiteSpace: 'nowrap' }}>
                      {init === 'SJ' ? 'Sarah' : init === 'MD' ? 'Mike' : 'Alex'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: newDeal.leadId ? '12px' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61' }}>ORIGINATION SIGNAL</div>
            </div>
            <textarea 
              value={newDeal.signal}
              onChange={(e) => {
                if (e.target.value.length <= 200) setNewDeal({ ...newDeal, signal: e.target.value });
              }}
              placeholder="What flagged this deal? e.g. Warm intro via network, Thesis screen match, Inbound from advisor" 
              rows={2} 
              style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', borderRadius: '3px', padding: '8px 12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', resize: 'vertical', outline: 'none' }}
            />
            <div className="mono" style={{ fontSize: '9px', color: '#4A4D61', textAlign: 'right', marginTop: '2px' }}>{newDeal.signal.length}/200</div>
          </div>
          <div className="mono" style={{ fontSize: '10px', color: '#8B7CF6', marginTop: '-4px' }}>AI will begin monitoring this deal immediately and surface signals within 24 hours.</div>
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E2028', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
           <button onClick={close} style={{ background: 'transparent', color: '#8B8FA8', border: '1px solid #262933', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>CANCEL</button>
           <button onClick={handleAddDeal} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>ADD DEAL</button>
        </div>
      </>
    );
  }

  if (modal.type === 'ADD_TASK') {
    const isCritical = newTask.urgency === 'CRITICAL';
    const isPlanned = newTask.urgency === 'PLANNED';
    const isWatch = newTask.urgency === 'WARNING' || newTask.urgency === 'WATCH';
    
    useEffect(() => {
      if (modal.data) {
        if (selectedDeal && !newTask.dealId) {
          setNewTask(prev => ({ ...prev, dealId: selectedDeal.id }));
        }
        if (modal.data.context && !newTask.signalContext) {
          setNewTask(prev => ({ ...prev, signalContext: modal.data.context, title: modal.data.title || prev.title, urgency: modal.data.urgency || prev.urgency }));
        }
      }
    }, [modal.data, selectedDeal]);

    const handleAddTask = () => {
      let hasError = false;
      if (!newTask.title.trim()) {
        setTitleError(true);
        setTimeout(() => setTitleError(false), 400);
        hasError = true;
      }
      
      const targetDealId = selectedDeal?.id || newTask.dealId;
      if (!targetDealId) {
        setDealError(true);
        setTimeout(() => setDealError(false), 400);
        hasError = true;
      }

      if (hasError) return;
      
      const newAction = {
        id: 'task-' + Date.now(),
        taskType: newTask.urgency === 'CRITICAL' ? 'FOLLOW_UP' : newTask.urgency === 'WATCH' ? 'VENDOR_CHASE' : 'DOCUMENT_REVIEW',
        urgency: newTask.urgency === 'CRITICAL' ? 'CRITICAL' : newTask.urgency === 'WATCH' ? 'WARNING' : 'PLANNED',
        title: newTask.title,
        owner: newTask.ownerId || 'SJ',
        ownerName: newTask.ownerId === 'MD' ? 'Mike D.' : newTask.ownerId === 'AW' ? 'Alex W.' : 'Sarah J.',
        deadline: newTask.dueDate || 'TBD',
        status: 'NOT_STARTED',
        signal: newTask.signalContext || 'Manually created task',
        signalSource: 'Created by you · Just now',
        isNew: true
      };

      setDeals(deals.map((d: any) => d.id === targetDealId ? { ...d, actions: [newAction, ...(d.actions || [])] } : d));
      
      const dealName = deals.find((d: any) => d.id === targetDealId)?.name || 'Deal';
      setToast({ type: 'success', message: `Task added to ${dealName} · ${newAction.ownerName} will be notified` });
      close();
    };

    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0' }}>Add Task</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder={titleError ? "What needs to happen?" : "What needs to happen?"} 
            className="titleInput"
            style={{ 
              width: '100%', background: 'transparent', border: 'none', 
              borderBottom: titleError ? '1px solid #E03E3E' : '1px solid #262933', 
              padding: '12px 0', fontSize: '14px', 
              color: titleError ? '#E03E3E' : '#E8EAF0', 
              outline: 'none', transition: 'border-color 0.4s' 
            }} 
          />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>DEAL</div>
               {!selectedDeal ? (
                 <>
                   <div 
                     onClick={() => setTaskDealSelectorOpen(!taskDealSelectorOpen)} 
                     style={{ width: '100%', background: '#0D0F15', border: `1px solid ${dealError ? '#E03E3E' : '#262933'}`, padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#E8EAF0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.4s' }}
                   >
                     {newTask.dealId ? deals.find((d: any) => d.id === newTask.dealId)?.name : 'Select Deal'} <span style={{ fontSize: '10px' }}>&darr;</span>
                   </div>
                   {taskDealSelectorOpen && (
                     <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#111318', border: '1px solid #262933', borderRadius: '3px', zIndex: 100, maxHeight: '160px', overflowY: 'auto' }}>
                       {deals.map((d: any) => (
                         <div 
                           key={d.id}
                           onClick={() => { setNewTask({ ...newTask, dealId: d.id }); setTaskDealSelectorOpen(false); }}
                           onMouseEnter={(e) => { e.currentTarget.style.background = '#181B22'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                           style={{ padding: '8px 12px', fontSize: '12px', color: newTask.dealId === d.id ? '#3D7EF8' : '#E8EAF0', cursor: 'pointer', borderLeft: newTask.dealId === d.id ? '2px solid #3D7EF8' : '2px solid transparent' }}
                         >
                           {d.name}
                         </div>
                       ))}
                     </div>
                   )}
                 </>
               ) : (
                 <div style={{ width: '100%', background: 'transparent', border: '1px dashed #262933', padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#8B8FA8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span>🔒</span> {selectedDeal.name}
                 </div>
               )}
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>URGENCY</div>
               <div style={{ display: 'flex', gap: '4px' }}>
                  <div onClick={() => setNewTask({...newTask, urgency: 'CRITICAL'})} style={{ flex: 1, textAlign: 'center', fontSize: '10px', padding: '6px 0', borderRadius: '3px', border: isCritical ? 'none' : '1px solid #262933', background: isCritical ? '#E03E3E' : 'transparent', color: isCritical ? '#fff' : '#4A4D61', cursor: 'pointer' }}>CRITICAL</div>
                  <div onClick={() => setNewTask({...newTask, urgency: 'WATCH'})} style={{ flex: 1, textAlign: 'center', fontSize: '10px', padding: '6px 0', borderRadius: '3px', border: isWatch ? 'none' : '1px solid #262933', background: isWatch ? '#E8943A' : 'transparent', color: isWatch ? '#080A0F' : '#4A4D61', cursor: 'pointer' }}>WATCH</div>
                  <div onClick={() => setNewTask({...newTask, urgency: 'PLANNED'})} style={{ flex: 1, textAlign: 'center', fontSize: '10px', padding: '6px 0', borderRadius: '3px', border: isPlanned ? 'none' : '1px solid #262933', background: isPlanned ? '#2EBD85' : 'transparent', color: isPlanned ? '#080A0F' : '#4A4D61', cursor: 'pointer' }}>PLANNED</div>
               </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>OWNER</div>
               <div style={{ display: 'flex', gap: '8px' }}>
                 {(selectedDeal ? (selectedDeal.team.length ? selectedDeal.team : ['SJ', 'MD', 'AW']) : ['SJ', 'MD', 'AW']).map((init: string) => (
                   <div 
                     key={init} 
                     onClick={() => setNewTask({ ...newTask, ownerId: newTask.ownerId === init ? null : init })}
                     style={{ width: '32px', height: '32px', borderRadius: '50%', background: newTask.ownerId === init ? '#0F1825' : '#262933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: newTask.ownerId === init ? '#3D7EF8' : '#E8EAF0', cursor: 'pointer', border: newTask.ownerId === init ? '2px solid #3D7EF8' : '2px solid transparent' }}
                   >
                     {init}
                   </div>
                 ))}
               </div>
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '6px' }}>DUE DATE</div>
               <input 
                 type="text" 
                 value={newTask.dueDate}
                 onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                 placeholder="Select date" 
                 className="mono" 
                 style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', padding: '8px 12px', borderRadius: '3px', fontSize: '12px', color: '#E8EAF0', outline: 'none', marginBottom: '8px' }} 
               />
               <div style={{ display: 'flex', gap: '6px' }}>
                 {['Today', 'Tomorrow', 'This Week'].map(dt => (
                   <div 
                     key={dt}
                     onClick={() => setNewTask({ ...newTask, dueDate: dt })}
                     style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '3px', border: newTask.dueDate === dt ? '1px solid #3D7EF8' : '1px solid #262933', color: newTask.dueDate === dt ? '#3D7EF8' : '#4A4D61', cursor: 'pointer' }}
                     onMouseEnter={(e) => { if (newTask.dueDate !== dt) { e.currentTarget.style.borderColor = '#3D7EF8'; e.currentTarget.style.color = '#3D7EF8'; } }}
                     onMouseLeave={(e) => { if (newTask.dueDate !== dt) { e.currentTarget.style.borderColor = '#262933'; e.currentTarget.style.color = '#4A4D61'; } }}
                   >
                     {dt}
                   </div>
                 ))}
               </div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61' }}>SIGNAL CONTEXT</span>
              <span style={{ fontSize: '10px', color: '#8B8FA8' }}>What prompted this task?</span>
            </div>
            {modal.data?.context && (
              <div className="mono" style={{ fontSize: '9px', color: '#8B7CF6', marginBottom: '4px' }}>⚡ Pre-filled from signal</div>
            )}
            <textarea 
              value={newTask.signalContext}
              onChange={(e) => setNewTask({ ...newTask, signalContext: e.target.value })}
              rows={2} 
              style={{ width: '100%', background: '#0D0F15', border: '1px solid #262933', borderRadius: '3px', padding: '8px 12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', resize: 'vertical', outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E2028', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
           <button onClick={close} style={{ background: 'transparent', color: '#8B8FA8', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>CANCEL</button>
           <button onClick={handleAddTask} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>CREATE TASK</button>
        </div>
      </>
    );
  }

  if (modal.type === 'VIEW_MODEL') {
    return (
      <>
        <div style={{ height: '48px', borderBottom: '1px solid #1E2028', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0' }}>Financial Model &middot; Optima Logistics</div>
          <div onClick={close} style={{ fontSize: '18px', color: '#4A4D61', cursor: 'pointer' }}>&times;</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#2EBD85', width: '14px', height: '14px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#fff' }}>X</div>
              <div style={{ fontSize: '13px', color: '#E8EAF0' }}>Financial Model.xlsx</div>
              <div className="mono" style={{ fontSize: '10px', color: '#4A4D61', marginLeft: '4px' }}>Updated 2h ago by Mike D.</div>
            </div>
            <div style={{ fontSize: '9px', color: '#E8943A', border: '1px solid #E8943A', padding: '1px 4px', borderRadius: '2px' }}>UNREVIEWED</div>
          </div>

          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '8px' }}>AI MODEL SUMMARY</div>
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #1E2028', borderRadius: '3px', marginBottom: '20px', overflow: 'hidden' }}>
            {[
              { label: 'Revenue', val: '$42.3M', vs: '+4.2% vs plan', trend: '↑', bg: '#0D0F15', dir: 'pos' },
              { label: 'EBITDA', val: '$8.1M', vs: '-6.2% vs plan', trend: '↓', bg: 'transparent', dir: 'neg' },
              { label: 'EBITDA Margin', val: '19.2%', vs: '-1.8pp', trend: '↓', bg: '#0D0F15', dir: 'neg' },
              { label: 'Working Capital', val: '$12.4M', vs: '+14% vs plan', trend: '↑', bg: 'transparent', dir: 'pos' }
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: r.bg }}>
                 <div style={{ fontSize: '12px', color: '#8B8FA8', width: '120px' }}>{r.label}</div>
                 <div className="mono" style={{ fontSize: '13px', color: '#E8EAF0', width: '80px' }}>{r.val}</div>
                 <div style={{ fontSize: '10px', color: r.dir==='pos'?'#2EBD85':'#E03E3E', width: '100px', textAlign: 'right' }}>{r.vs} {r.trend}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#0D0F15', borderLeft: '2px solid #8B7CF6', padding: '10px 12px', borderRadius: '3px' }}>
            <div style={{ fontSize: '9px', color: '#8B7CF6', textTransform: 'uppercase', marginBottom: '4px' }}>INFERENCE</div>
            <div style={{ fontSize: '12px', color: '#8B8FA8', lineHeight: 1.5 }}>EBITDA underperformance is concentrated in the APAC segment. Revenue outperformance in EMEA is masking the variance at the top level. Management commentary has not addressed the segment split in the last two updates.</div>
          </div>
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1E2028', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div onClick={close} style={{ fontSize: '11px', color: '#4A4D61', cursor: 'pointer' }}>Close</div>
           <div style={{ display: 'flex', gap: '8px' }}>
             <button onClick={() => { setToast({ type: 'success', message: 'Model marked as reviewed · Logged against Optima Logistics' }); close(); }} style={{ background: 'transparent', color: '#2EBD85', border: '1px solid #2EBD85', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>MARK AS REVIEWED</button>
             <button onClick={() => setToast({ type: 'info', message: 'Opening Financial Model.xlsx in Excel \u2197' })} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>OPEN IN EXCEL &nearr;</button>
           </div>
        </div>
      </>
    );
  }

  return null;
}

export default function DealOS() {
  const [activeModule, setActiveModule] = useState('HOME');
  const [filters, setFilters] = useState<{priority: string|null, type: string|null, context: string|null}>({ priority: null, type: null, context: null });
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>('dec1');
  const [currentMode, setCurrentMode] = useState<'EXECUTION' | 'PORTFOLIO' | 'SOURCING'>('EXECUTION');

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'warning' } | null>(null);
  const [slidePanel, setSlidePanel] = useState<{ type: string, data?: any } | null>(null);
  const [modal, setModal] = useState<{ type: string, data?: any } | null>(null);
  const [confirmedCards, setConfirmedCards] = useState<string[]>([]);
  const [viewAllSection, setViewAllSection] = useState<string | null>(null);

  const [dec1Owner, setDec1Owner] = useState('Mike D.');
  const [hasScheduledTime, setHasScheduledTime] = useState(false);
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [cardStatuses, setCardStatuses] = useState<Record<string, string>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [rightPanelQuery, setRightPanelQuery] = useState('');
  const [rightPanelOutput, setRightPanelOutput] = useState<{query: string, response: string, time: string} | null>(null);
  const [todayTasks, setTodayTasks] = useState([
    {
      id: 't1',
      time: "09:00",
      context: "PROJECT ATHENA",
      contextColor: "#3D7EF8",
      cardBorderColor: "#3D7EF8",
      title: "Zoom Enhancements — final review",
      owner: "Myself",
      deadline: "Today, 09:00",
      status: "IN_PROGRESS",
      taskType: "APPROVAL",
      signal: "Awaiting your sign-off before handoff to engineering.",
      signalSource: "Project thread · 1h ago"
    },
    {
      id: 't2',
      time: "10:30",
      context: "MAXBUPA",
      contextColor: "#3D7EF8",
      cardBorderColor: "#E8943A",
      title: "Usage Analytics — weekly report",
      owner: "Abhijeet Sinha",
      deadline: "Today, 10:30",
      status: "NOT_STARTED",
      taskType: "DOCUMENT_REVIEW",
      signal: "Abhijeet submitted the draft 2 hours ago. No review yet.",
      signalSource: "Submitted 2h ago",
      docName: "Usage Analytics Report W16.pdf",
      docTag: "UNREVIEWED",
      docColor: "#E8943A",
      aiSummary: [
        "Report covers 4 weeks of platform usage across 3 business units.",
        "DAU down 12% vs prior period — concentrated in claims module.",
        "2 feature requests flagged by power users in the appendix.",
        "No critical issues. Sign-off recommended with minor annotations."
      ]
    },
    {
       id: 't3',
       time: "13:00",
       context: "PROJECT DIAMOND",
       contextColor: "#3D7EF8",
       cardBorderColor: "#E03E3E",
       title: "Go Live Issues — resolution call",
       owner: "Abhijeet Sinha",
       deadline: "Today, 13:00",
       status: "NOT_STARTED",
       taskType: "FOLLOW_UP",
       signal: "3 go-live blockers still open. Call in 2 hours.",
       signalSource: "Issue tracker · Updated 30m ago",
       draftCopy: "Hi Abhijeet, ahead of today's call — can you send across the current status on the 3 open blockers so we can prioritise the agenda? Need it 30 mins before we connect."
    },
    {
       id: 't4',
       time: "14:00",
       context: "KELP",
       contextColor: "#4A4D61",
       cardBorderColor: "#4A4D61",
       title: "Azure to Teams migration — IM, BM and TA accounts",
       owner: "Rohit Prasad",
       deadline: "Tomorrow",
       status: "NOT_STARTED",
       taskType: "VENDOR_CHASE",
       signal: "Migration window was 09:00 today. No completion confirmation received.",
       signalSource: "IT thread · Detected 4h ago",
       draftCopy: "Hi Rohit, checking on the Azure → Teams migration for IM, BM and TA — the window was this morning but I haven't seen a completion confirmation. What's the current status?"
    },
    {
       id: 't5',
       time: "17:30",
       context: "FITRANGI ADVENTURE NETWORKS",
       contextColor: "#3D7EF8",
       cardBorderColor: "#E8943A",
       title: "Development process and DevOps — handover notes",
       owner: "Rohit Prasad",
       deadline: "Today, EOD",
       status: "NOT_STARTED",
       taskType: "DOCUMENT_REVIEW",
       signal: "Handover doc shared yesterday. Sign-off needed before DevOps team proceeds.",
       signalSource: "Doc shared · 1d ago",
       docName: "DevOps Handover Notes v2.docx",
       docTag: "UNREVIEWED",
       docColor: "#E8943A",
       aiSummary: [
         "Covers CI/CD pipeline setup for 3 environments.",
         "Staging environment config has an unresolved dependency flag.",
         "Rollback procedure documented but not yet tested.",
         "Recommend sign-off conditional on staging dependency resolution."
       ]
    },
    {
       id: 't6',
       time: "—",
       context: "HOME FIRST FINANCE",
       contextColor: "#3D7EF8",
       cardBorderColor: "#3D7EF8",
       title: "One Note Integration — requirements sign-off",
       owner: "Myself",
       deadline: "Today, EOD",
       status: "NOT_STARTED",
       taskType: "APPROVAL",
       signal: "Requirements doc finalized and awaiting your approval before dev sprint begins.",
       signalSource: "PM update · 3h ago"
    }
  ]);

  const [newRequests, setNewRequests] = useState([
    {
       id: 'r1',
       context: "SEMI ANNUAL SELF DECLARATION",
       contextColor: "#4A4D61",
       assignedBy: "Priya T.",
       assignedAgo: "1 day ago",
       title: "Complete semi-annual self-declaration form",
       deadline: "4 days",
       note: "Compliance deadline is firm. Please complete before the 25th or it escalates to HR."
    },
    {
       id: 'r2',
       context: "MAXBUPA",
       contextColor: "#3D7EF8",
       assignedBy: "Abhijeet Sinha",
       assignedAgo: "3 hours ago",
       title: "Review Q2 engagement summary deck",
       deadline: "23 Jun",
       note: "Need your comments before I send to the client. 30 mins should be enough."
    },
    {
       id: 'r3',
       context: "RDC CONCRETE",
       contextColor: "#3D7EF8",
       assignedBy: "Rohit Prasad",
       assignedAgo: "2 days ago",
       title: "Validate RDC Concrete site inspection findings",
       deadline: "This week",
       note: "Site team flagged 2 items that need partner-level review before we can proceed."
    }
  ]);

  const [backlogTasks, setBacklogTasks] = useState([
    { id: 'b1', context: "HICARE", title: "Q3 vendor assessment review" },
    { id: 'b2', context: "CEO SESA OILS", title: "Prepare intro deck for partnership call" },
    { id: 'b3', context: "MANAPPURAM FINANCE", title: "Review credit facility amendment" },
    { id: 'b4', context: "KELP", title: "Update onboarding documentation" },
    { id: 'b5', context: "PROJECT ATHENA", title: "Post-launch UX feedback synthesis" }
  ]);
  const [backlogCount, setBacklogCount] = useState(20);
  const [backlogExpanded, setBacklogExpanded] = useState(false);
  const [backlogSort, setBacklogSort] = useState('Staleness');
  const [activeDay, setActiveDay] = useState('TODAY');
  const [backlogVisible, setBacklogVisible] = useState(5);

  const [dealTasksData, setDealTasksData] = useState<any[]>([]);
  const [dealTasksGen, setDealTasksGen] = useState(false);
  const [dealTasksExp, setDealTasksExp] = useState<string | null>(null);
  const [intelligenceLinkTarget, setIntelligenceLinkTarget] = useState<string | null>(null);
  const [dismissedCards, setDismissedCards] = useState<string[]>([]);
  const [addedMembers, setAddedMembers] = useState<string[]>([]);
  const [isModelReviewed, setIsModelReviewed] = useState(false);
  const [generatingTasks, setGeneratingTasks] = useState(false);

  const acmeDeal = deals.find(d => d.id === 'acme') || pipelineTargets.find(d => d.id === 'acme');
  const nebulaDeal = deals.find(d => d.id === 'nebula') || pipelineTargets.find(d => d.id === 'nebula');
  const titanDeal = deals.find(d => d.id === 'titan') || pipelineTargets.find(d => d.id === 'titan');
  const optimaDeal = deals.find(d => d.id === 'optima') || pipelineTargets.find(d => d.id === 'optima');
  
  const selectedDeal = deals.find(d => d.id === selectedDealId) || pipelineTargets.find(d => d.id === selectedDealId) || null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal !== null) {
        setModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal]);

  useEffect(() => {
    if (selectedDeal && (selectedDeal as any).actions) {
      setDealTasksData((selectedDeal as any).actions.map((a: any) => ({
        id: a.id,
        title: a.title,
        urgency: a.urgency,
        owner: a.owner,
        due: a.deadline,
        bg: a.urgency === 'CRITICAL' ? COLORS.red : a.urgency === 'WARNING' ? COLORS.amber : COLORS.blue,
        type: a.taskType,
        status: a.status.replace('_', ' '),
        signal: a.signal,
        source: a.signalSource,
        draftCopy: a.draftCopy,
        docName: a.docName,
        docColor: a.docColor,
        docTag: a.docTag,
        aiSummary: a.aiSummary,
        time: null,
        isNew: a.isNew
      })));
      setDealTasksGen(true);
    } else {
      setDealTasksData([]);
      setDealTasksGen(false);
    }
  }, [selectedDealId, deals]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Sparkline generator
  const renderSparkline = (data: number[], color: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * 48;
      const y = 14 - ((val - min) / range) * 14;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="48" height="14" viewBox="0 0 48 14" style={{ display: 'block' }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const enrichedTodayTasks = todayTasks.map(task => {
    let priority = (task as any).priority;
    let type = (task as any).type;
    let uiContext = (task as any).uiContext;

    if (!priority || !type) {
        if (task.taskType === 'FOLLOW_UP') { type = 'FOLLOW-UP'; priority = 'HIGH'; }
        else if (task.taskType === 'VENDOR_CHASE') { type = 'FOLLOW-UP'; priority = 'MED'; }
        else if (task.taskType === 'DOCUMENT_REVIEW') { type = 'REVIEW'; priority = 'MED'; }
        else if (task.taskType === 'APPROVAL') { type = 'APPROVAL'; priority = 'HIGH'; }
        else if (task.taskType === 'BLOCKER') { type = 'FOLLOW-UP'; priority = 'HIGH'; }
        else { type = 'REVIEW'; priority = 'MED'; } 
    }
    if (!uiContext) {
        if (task.context === 'KELP') uiContext = 'INTERNAL';
        else if (task.owner === 'Myself') uiContext = 'PERSONAL';
        else uiContext = 'CLIENT';
    }

    return { ...task, priority, type, uiContext };
  });

  const filteredTasks = enrichedTodayTasks.filter(task => {
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.type && task.type !== filters.type) return false;
    if (filters.context && task.uiContext !== filters.context) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <style>{globalStyles}</style>

      {/* --- CONTEXT MODE BAR --- */}
      <div style={{ 
        height: '28px', 
        backgroundColor: '#0C0E14', 
        borderBottom: '1px solid #1E2028',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['EXECUTION', 'PORTFOLIO', 'SOURCING'] as const).map(mode => (
            <div 
              key={mode}
              onClick={() => setCurrentMode(mode)}
              style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: `'JetBrains Mono', monospace`,
                padding: '4px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                background: currentMode === mode ? '#0F1825' : 'transparent',
                border: currentMode === mode ? '1px solid #3D7EF8' : '1px solid #262933',
                color: currentMode === mode ? '#3D7EF8' : '#4A4D61',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={(e) => {
                if (currentMode !== mode) {
                  e.currentTarget.style.borderColor = '#8B8FA8';
                  e.currentTarget.style.color = '#8B8FA8';
                }
              }}
              onMouseLeave={(e) => {
                if (currentMode !== mode) {
                  e.currentTarget.style.borderColor = '#262933';
                  e.currentTarget.style.color = '#4A4D61';
                }
              }}
            >
              {mode === 'EXECUTION' ? 'DEAL EXECUTION' : mode}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '10px', fontFamily: `'JetBrains Mono', monospace`, color: '#4A4D61' }}>
          Reframing for {currentMode === 'EXECUTION' ? 'deal execution' : currentMode === 'PORTFOLIO' ? 'portfolio monitoring' : 'deal sourcing'}
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, width: '100vw', overflow: 'hidden' }}>
        {/* A) NEW MODULE NAV STRIP */}
        <aside style={{ width: '52px', flexShrink: 0, backgroundColor: '#0A0C12', borderRight: '1px solid #1E2028', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ fontSize: '11px', fontWeight: 700, color: '#E8EAF0', padding: '12px 0', textAlign: 'center', width: '100%', borderBottom: '1px solid #1E2028', flexShrink: 0 }}>OS</div>
           
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             {[
               { id: 'HOME', label: 'HOME', icon: <path d="M1 6L6.5 1L12 6V12H8.5V8.5H4.5V12H1Z"/> },
               { id: 'RA', label: 'R&A', icon: <><circle cx="5.5" cy="5.5" r="3.5"/><line x1="8" y1="8" x2="12" y2="12"/></> },
               { id: 'IM', label: 'IM', icon: <><rect x="1" y="5" width="11" height="7" rx="1"/><path d="M4 5V3.5a1.5 1.5 0 013 0V5"/></> },
               { id: 'BM', label: 'BM', icon: <><rect x="1" y="9" width="3" height="3"/><rect x="5" y="6" width="3" height="6"/><rect x="9" y="3" width="3" height="9"/></> },
               { id: 'TA', label: 'TA', icon: <><path d="M2 1h7l3 3v9H2z"/><line x1="5" y1="8" x2="10" y2="8"/><line x1="5" y1="11" x2="7.5" y2="11"/></> },
               { id: 'IR', label: 'IR', icon: <><circle cx="6.5" cy="4" r="2.5"/><path d="M1 12c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/></> },
               { id: 'VM', label: 'VM', icon: <><polyline points="1,10 4,7 7,8.5 12,2"/><polyline points="9.5,2 12,2 12,4.5"/></> }
             ].map(mod => (
               <div 
                 key={mod.id}
                 onClick={() => { setActiveModule(mod.id); setToast({ type: 'info', message: `Switched to ${mod.label}` }); }}
                 style={{ width: '52px', height: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer', borderLeft: activeModule === mod.id ? '2px solid #3D7EF8' : '2px solid transparent', background: activeModule === mod.id ? '#111318' : 'transparent', transition: 'all 120ms' }}
               >
                 <svg width="13" height="13" viewBox="0 0 13 13" fill="none" strokeWidth="1.5" strokeLinecap="round" stroke={activeModule === mod.id ? '#3D7EF8' : '#4A4D61'}>{mod.icon}</svg>
                 <span style={{ fontSize: '7px', fontFamily: 'monospace', textTransform: 'uppercase', color: activeModule === mod.id ? '#3D7EF8' : '#4A4D61' }}>{mod.label}</span>
               </div>
             ))}
           </div>
           
         </aside>

        {activeModule === 'HOME' ? (
        <>
        {/* --- LEFT RAIL --- */}
        <aside style={{ width: 'calc(20vw - 52px)', minWidth: '130px', overflow: 'hidden', backgroundColor: COLORS.rail, borderRight: `1px solid ${COLORS.borderSubtle}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        {/* Vital Signs / Pipeline list */}
        <div style={{ flex: 1, paddingTop: '16px' }}>
          <div style={{ padding: '0 16px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '8px' }}>
            {currentMode === 'EXECUTION' ? 'DEAL VITAL SIGNS' : 
             currentMode === 'PORTFOLIO' ? 'PORTFOLIO VITALS' : 
             'PIPELINE TARGETS'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {deals.map(deal => {
              const isActive = selectedDealId === deal.id;
              
              // Mode visibility logic
              let isVisible = true;
              let isDimmed = false;
              let customSignal = deal.signal;
              let drift: string | null = null;
              
              if (currentMode === 'PORTFOLIO') {
                if (deal.stage !== 'PORTFOLIO' && deal.stage !== 'EXECUTION') {
                  isDimmed = true;
                }
                if (deal.id === 'acme') {
                  drift = '↓7.1%';
                  customSignal = 'Board pack due 12 days';
                } else if (deal.id === 'optima') {
                  drift = '↑4.2%';
                  customSignal = 'EBITDA tracking +4.2% vs plan';
                }
              } else if (currentMode === 'SOURCING') {
                if (deal.stage !== 'SOURCING') isDimmed = true;
              }

              const sColor = deal.scoreColor;
              const opacityNum = isDimmed ? 0.4 : 1;

              return (
                <div 
                  key={deal.id} 
                  className="rail-item"
                  style={{ 
                    padding: '14px 16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px',
                    borderLeft: isActive ? `3px solid ${COLORS.blue}` : '3px solid transparent',
                    background: isActive ? '#0F1117' : 'transparent',
                    paddingLeft: isActive ? '13px' : '16px',
                    opacity: opacityNum,
                    transition: 'opacity 200ms ease',
                    cursor: isDimmed ? 'default' : 'pointer'
                  }}
                  onClick={() => {
                    if (!isDimmed) setSelectedDealId(isActive ? null : deal.id);
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: COLORS.textSecondary, border: `1px solid ${COLORS.borderDefault}`, borderRadius: '999px', padding: '1px 6px' }}>{deal.stage}</span>
                      {(deal as any).isNew && (
                        <span style={{ fontSize: '9px', color: '#2EBD85', border: '1px solid #2EBD85', borderRadius: '3px', padding: '0 4px', animation: 'fadeOut 4s forwards' }}>NEW</span>
                      )}
                    </div>
                    <span className="mono" style={{ fontSize: '12px', color: sColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {currentMode === 'PORTFOLIO' && !isDimmed && drift ? drift : `${deal.score === 0 ? '—' : deal.score} ${deal.direction}`}
                      {(!drift && currentMode !== 'PORTFOLIO' && deal.score !== 0) && ` ${deal.delta}`}
                    </span>
                  </div>
                  {(!isDimmed || currentMode === 'EXECUTION') && (
                    <div style={{ paddingTop: '2px' }}>
                      {renderSparkline(deal.pulse, sColor)}
                    </div>
                  )}
                  {isDimmed && currentMode === 'PORTFOLIO' && (
                    <div style={{ fontSize: '9px', color: COLORS.textMuted, marginTop: '2px' }}>Not in view</div>
                  )}
                  {isDimmed && currentMode === 'SOURCING' && (
                    <div style={{ fontSize: '9px', color: COLORS.textMuted, marginTop: '2px' }}>Active deal &mdash; switch mode</div>
                  )}
                  {(!isDimmed || currentMode === 'EXECUTION') && (
                    <div style={{ fontSize: '10px', color: COLORS.textMuted, fontStyle: 'italic', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {customSignal}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Show prospects only in Sourcing mode */}
            {currentMode === 'SOURCING' && (
              <>
                {pipelineTargets.map(target => {
                  const isActive = selectedDealId === target.id;
                  return (
                  <div 
                    key={target.id}
                    className="rail-item"
                    onClick={() => setSelectedDealId(isActive ? null : target.id)}
                    style={{ 
                      padding: '14px 16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      borderLeft: isActive ? `3px solid ${COLORS.blue}` : '3px solid transparent',
                      background: isActive ? '#111318' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{target.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: COLORS.textSecondary, border: `1px solid ${COLORS.borderDefault}`, borderRadius: '999px', padding: '1px 6px' }}>{target.stage}</span>
                      <span className="mono" style={{ fontSize: '10px', color: COLORS.textSecondary, whiteSpace: 'nowrap', flexShrink: 0 }}>Fit: {target.score} {target.direction}</span>
                    </div>
                    <div style={{ paddingTop: '2px' }}>
                      {renderSparkline(target.pulse, COLORS.blue)}
                    </div>
                    <div style={{ fontSize: '10px', color: COLORS.textMuted, fontStyle: 'italic', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {target.signal}
                    </div>
                  </div>
                )})}
                
                {/* Network Proximity Section */}
                <div style={{ padding: '16px 16px 0 16px' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: '12px' }}>
                    NETWORK PROXIMITY
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '11px', color: '#8B8FA8', flex: 1, lineHeight: 1.4 }}>
                        Meridian Healthcare &middot; 2nd degree &middot; via Sarah J.
                      </span>
                      <span style={{ fontSize: '9px', color: COLORS.green, border: `1px solid ${COLORS.green}`, padding: '1px 4px', borderRadius: '2px', flexShrink: 0 }}>WARM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '11px', color: '#8B8FA8', flex: 1, lineHeight: 1.4 }}>
                        Vantage Infrastructure &middot; 3rd degree &middot; via Mike D. &rarr; CFO
                      </span>
                      <span style={{ fontSize: '9px', color: COLORS.textMuted, border: `1px solid ${COLORS.borderDefault}`, padding: '1px 4px', borderRadius: '2px', flexShrink: 0 }}>COLD</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            
          </div>
        </div>

        {/* Bottom Rail User settings */}
        <div style={{ padding: '16px', borderTop: `1px solid ${COLORS.borderSubtle}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', color: COLORS.textMuted }}>SYSTEM</span>
            <div style={{ width: '4px', height: '4px', backgroundColor: COLORS.green, borderRadius: '50%' }}></div>
            <span className="mono" style={{ fontSize: '10px', color: COLORS.green }}>Intelligence active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLORS.borderDefault, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                SJ
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: COLORS.textPrimary }}>Sarah J.</span>
                <span style={{ fontSize: '10px', color: COLORS.textMuted }}>Senior Associate</span>
              </div>
            </div>
            <svg onClick={() => setToast({ type: 'info', message: 'Settings \u00B7 Coming in next release' })} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#4A4D61" strokeWidth="1.5" cursor="pointer" style={{ marginLeft: 'auto' }}>
              <circle cx="7" cy="7" r="2.5"/>
              <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13"/>
            </svg>
          </div>
        </div>
      </aside>

      {/* --- CENTER PANEL --- */}
      <main style={{ width: '55vw', flexShrink: 0, flexGrow: 0, minWidth: '340px', backgroundColor: COLORS.bg, borderRight: `1px solid ${COLORS.borderSubtle}`, overflowX: 'hidden', overflowY: 'auto', position: 'relative' }}>
        
        {/* Container for State transitions */}
        <div style={{ 
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column'
        }}>
          {!selectedDeal ? (
            /* ================== STATE 1: HOME BRIEF ================== */
            <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ position: 'sticky', top: 0, background: COLORS.bg, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '48px', borderBottom: `1px solid ${COLORS.borderSubtle}` }}>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: COLORS.textPrimary }}>Morning Brief</span>
                  <div style={{ textAlign: 'right' }}>
                     <div className="mono" style={{ fontSize: '12px', color: COLORS.textSecondary }}>{dateStr}</div>
                     <div className="mono" style={{ fontSize: '10px', color: '#8B7CF6' }}>
                       {currentMode === 'EXECUTION' ? 'Optimised for deal execution · 2 decisions require input' : 
                        currentMode === 'PORTFOLIO' ? 'Optimised for portfolio monitoring · 1 KPI alert requires review' : 
                        'Optimised for deal sourcing · 1 intro path ready to activate'}
                     </div>
                  </div>
                </div>
                {/* FILTER ROW */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 20px', borderBottom: '1px solid #1E2028', flexWrap: 'nowrap', overflowX: 'auto', background: '#080A0F', flexShrink: 0, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                   {/* GROUP 1 — PRIORITY */}
                   <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                     <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#4A4D61', whiteSpace: 'nowrap', flexShrink: 0 }}>PRIORITY</span>
                     {['HIGH', 'MED', 'LOW'].map(opt => (
                       <div key={opt} 
                            onClick={() => setFilters(prev => ({ ...prev, priority: prev.priority === opt ? null : opt }))}
                            onMouseEnter={(e) => { if (filters.priority !== opt) { e.currentTarget.style.color = '#8B8FA8'; e.currentTarget.style.borderColor = '#8B8FA8'; } }}
                            onMouseLeave={(e) => { if (filters.priority !== opt) { e.currentTarget.style.color = '#4A4D61'; e.currentTarget.style.borderColor = '#262933'; } }}
                            style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: filters.priority === opt ? '#3D7EF8' : '#4A4D61', border: `1px solid ${filters.priority === opt ? '#3D7EF8' : '#262933'}`, background: filters.priority === opt ? '#0F1825' : 'transparent', borderRadius: '3px', padding: '3px 9px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 100ms', userSelect: 'none' }}>
                         {opt}
                       </div>
                     ))}
                   </div>
                   {/* GROUP 2 — TYPE */}
                   <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                     <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#4A4D61', whiteSpace: 'nowrap', flexShrink: 0 }}>TYPE</span>
                     {['APPROVAL', 'REVIEW', 'FOLLOW-UP'].map(opt => (
                       <div key={opt} 
                            onClick={() => setFilters(prev => ({ ...prev, type: prev.type === opt ? null : opt }))}
                            onMouseEnter={(e) => { if (filters.type !== opt) { e.currentTarget.style.color = '#8B8FA8'; e.currentTarget.style.borderColor = '#8B8FA8'; } }}
                            onMouseLeave={(e) => { if (filters.type !== opt) { e.currentTarget.style.color = '#4A4D61'; e.currentTarget.style.borderColor = '#262933'; } }}
                            style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: filters.type === opt ? '#3D7EF8' : '#4A4D61', border: `1px solid ${filters.type === opt ? '#3D7EF8' : '#262933'}`, background: filters.type === opt ? '#0F1825' : 'transparent', borderRadius: '3px', padding: '3px 9px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 100ms', userSelect: 'none' }}>
                         {opt}
                       </div>
                     ))}
                   </div>
                   {/* GROUP 3 — CONTEXT */}
                   <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                     <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: '#4A4D61', whiteSpace: 'nowrap', flexShrink: 0 }}>CONTEXT</span>
                     {['CLIENT', 'INTERNAL', 'PERSONAL'].map(opt => (
                       <div key={opt} 
                            onClick={() => setFilters(prev => ({ ...prev, context: prev.context === opt ? null : opt }))}
                            onMouseEnter={(e) => { if (filters.context !== opt) { e.currentTarget.style.color = '#8B8FA8'; e.currentTarget.style.borderColor = '#8B8FA8'; } }}
                            onMouseLeave={(e) => { if (filters.context !== opt) { e.currentTarget.style.color = '#4A4D61'; e.currentTarget.style.borderColor = '#262933'; } }}
                            style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: filters.context === opt ? '#3D7EF8' : '#4A4D61', border: `1px solid ${filters.context === opt ? '#3D7EF8' : '#262933'}`, background: filters.context === opt ? '#0F1825' : 'transparent', borderRadius: '3px', padding: '3px 9px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 100ms', userSelect: 'none' }}>
                         {opt}
                       </div>
                     ))}
                   </div>
                   
                   {(filters.priority || filters.type || filters.context) && (
                     <div onClick={() => setFilters({ priority: null, type: null, context: null })}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#E8EAF0'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#4A4D61'}
                          style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '10px', color: '#4A4D61', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                       Clear filters
                     </div>
                   )}
                </div>
              </div>

              {/* Command Bar */}
              <div style={{ padding: '16px' }}>
                <div style={{ background: COLORS.rail, border: `1px solid ${COLORS.borderDefault}`, borderRadius: '3px', height: '44px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
                   <span className="mono" style={{ color: COLORS.blue, fontSize: '14px' }}>›</span>
                   <input 
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
                   />
                </div>
                {rightPanelOutput && (
                    <div style={{ background: '#0D0F15', border: '1px solid #1E2028', borderRadius: '3px', padding: '10px 12px', marginTop: '8px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '12px', color: '#4A4D61', cursor: 'pointer', padding: '0 2px' }} onClick={() => setRightPanelOutput(null)} onMouseEnter={(e) => e.currentTarget.style.color = '#E8EAF0'} onMouseLeave={(e) => e.currentTarget.style.color = '#4A4D61'}>×</div>
                        <div className="mono" style={{ fontSize: '9px', color: '#4A4D61', marginBottom: '5px' }}>› {rightPanelOutput.query.length > 35 ? rightPanelOutput.query.slice(0,35) + '...' : rightPanelOutput.query}</div>
                        <div style={{ fontSize: '11px', color: '#E8EAF0', lineHeight: 1.5 }}>{rightPanelOutput.response}</div>
                        <div className="mono" style={{ fontSize: '9px', color: '#4A4D61', marginTop: '4px' }}>{rightPanelOutput.time}</div>
                    </div>
                 )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                   {['Maxbupa tasks this week', "What's overdue across my projects", 'Project Diamond go-live status'].map(pill => (
                     <span 
                       key={pill} 
                       className="mono" 
                       onClick={() => setRightPanelQuery(pill)}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.borderColor = '#3D7EF8';
                         e.currentTarget.style.color = '#3D7EF8';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.borderColor = COLORS.textMuted;
                         e.currentTarget.style.color = COLORS.textMuted;
                       }}
                       style={{ fontSize: '10px', color: COLORS.textMuted, border: `1px solid ${COLORS.textMuted}`, borderRadius: '3px', padding: '2px 6px', cursor: 'pointer' }}
                     >
                       {pill}
                     </span>
                   ))}
                </div>
              </div>

              {/* Dynamic Content based on Mode */}
              <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
                
                {currentMode === 'EXECUTION' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 150ms ease-in forwards' }}>
                    
                    {/* DAY TABS BAR */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #1E2028', marginBottom: '20px', marginLeft: '-16px', marginRight: '-16px', paddingLeft: '16px' }}>
                      {[
                        { id: 'TODAY', label: 'Today', count: filteredTasks.length },
                        { id: 'TOMORROW', label: 'Tomorrow', count: 4 },
                        { id: 'THIS_WEEK', label: 'This Week', count: 9 },
                        { id: 'LATER', label: 'Later', count: 20 }
                      ].map(tab => (
                        <div
                          key={tab.id}
                          onClick={() => setActiveDay(tab.id)}
                          style={{
                            padding: '8px 14px',
                            cursor: 'pointer',
                            borderBottom: activeDay === tab.id ? '2px solid #3D7EF8' : '2px solid transparent',
                            marginBottom: '-1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ fontSize: '12px', color: activeDay === tab.id ? '#E8EAF0' : '#8B8FA8', fontWeight: activeDay === tab.id ? 600 : 400 }}>{tab.label}</span>
                          <span className="mono" style={{ fontSize: '10px', background: activeDay === tab.id ? '#0F1825' : '#181B22', color: activeDay === tab.id ? '#3D7EF8' : '#4A4D61', borderRadius: '3px', padding: '1px 5px' }}>{tab.count}</span>
                        </div>
                      ))}
                    </div>

                    {activeDay !== 'TODAY' && (
                      <div style={{ padding: '24px 0', textAlign: 'center' }}>
                        <div className="mono" style={{ fontSize: '11px', color: '#4A4D61', marginBottom: '8px' }}>
                          {activeDay === 'TOMORROW' ? '4 tasks scheduled' : activeDay === 'THIS_WEEK' ? '9 tasks this week' : '20 tasks in backlog'}
                        </div>
                        <div className="mono" style={{ fontSize: '10px', color: '#262933' }}>
                          {activeDay === 'TOMORROW' ? 'ARR model sign-off · Clause 8.3 follow-up · Q2 pipeline review · Sprint kickoff' : activeDay === 'THIS_WEEK' ? 'Client QBR prep · Go-live sign-off · DevOps handover · Board pack review · +5 more' : 'View backlog section below for full list'}
                        </div>
                      </div>
                    )}

                    {/* 1. TODAY */}
                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <span style={{ fontSize: '9px', color: '#4A4D61', textTransform: 'uppercase' }}>
                          {activeDay === 'TODAY' ? 'TODAY' : activeDay === 'TOMORROW' ? 'TOMORROW' : activeDay === 'THIS_WEEK' ? 'THIS WEEK' : 'LATER'}
                        </span>
                        <span className="mono" style={{ fontSize: '9px', color: '#4A4D61' }}>25 Apr &middot; {filteredTasks.length} tasks</span>
                      </div>
                      
                      {activeDay === 'TODAY' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {filteredTasks.length === 0 ? (
                          (filters.priority || filters.type || filters.context) ? (
                            <div className="mono" style={{ padding: '16px 0 0 44px', fontSize: '11px', color: '#4A4D61' }}>
                              No tasks match this filter &middot; <span onClick={() => setFilters({ priority: null, type: null, context: null })} style={{ color: '#3D7EF8', cursor: 'pointer' }}>Clear filters</span>
                            </div>
                          ) : (
                            <div className="mono" style={{ padding: '14px', textAlign: 'center', fontSize: '11px', color: '#4A4D61' }}>Nothing here &middot; You're clear</div>
                          )
                        ) : filteredTasks.map(task => (
                          <div key={task.id} style={{ display: 'flex', width: '100%' }}>
                            <div className="mono" style={{ width: '40px', flexShrink: 0, textAlign: 'right', paddingRight: '12px', fontSize: '10px', color: '#4A4D61', paddingTop: '14px' }}>
                              {task.time}
                            </div>
                            <div style={{ flex: 1, background: '#111318', borderLeft: `3px solid ${task.cardBorderColor}`, borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '9px', textTransform: 'uppercase', border: `1px solid ${task.contextColor}`, color: task.contextColor, borderRadius: '3px', padding: '2px 6px' }}>{task.context}</span>
                                  <span style={{ fontSize: '9px', textTransform: 'uppercase', border: `1px solid ${task.status === 'DONE' ? '#2EBD85' : task.status === 'IN_PROGRESS' ? '#E8943A' : '#4A4D61'}`, color: task.status === 'DONE' ? '#2EBD85' : task.status === 'IN_PROGRESS' ? '#E8943A' : '#4A4D61', borderRadius: '3px', padding: '2px 6px' }}>{task.status.replace('_', ' ')}</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0', marginBottom: '6px' }}>{task.title}</div>
                                <div className="mono" style={{ fontSize: '11px', color: '#4A4D61' }}>Owner: {task.owner} &middot; {task.deadline}</div>
                              </div>
                              <div style={{ borderTop: '1px solid #1E2028', background: '#0D0F15', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
                                <span className="mono" style={{ fontSize: '11px', color: '#8B8FA8' }}>{task.signalSource || task.signal}</span>
                                <button onClick={(e) => {
                                      e.stopPropagation();
                                      if (task.taskType === 'APPROVAL') {
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'DONE' }));
                                        setToast({ type: 'success', message: `${task.title} approved \u00B7 Logged at ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` });
                                      } else if (task.taskType === 'DOCUMENT_REVIEW') {
                                        setExpandedCard(expandedCard === task.id ? null : task.id);
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'info', message: `Opening ${task.docName || 'document'} \u00B7 Review mode active` });
                                      } else if (task.taskType === 'FOLLOW_UP') {
                                        setExpandedCard(expandedCard === task.id ? null : task.id);
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'info', message: `Draft ready \u00B7 ${task.context} \u00B7 Review before sending` });
                                      } else if (task.taskType === 'VENDOR_CHASE') {
                                        setCardStatuses(prev => ({ ...prev, [task.id]: 'IN_PROGRESS' }));
                                        setToast({ type: 'success', message: `Chase sent to ${task.owner} \u00B7 Response requested by EOD` });
                                      } else if (task.taskType === 'BLOCKER') {
                                        setSlidePanel({ type: 'REASSIGN', data: { taskTitle: task.title, ownerName: task.owner, context: 'Escalation' } });
                                      }
                                    }} style={{ background: 'transparent', border: `1px solid ${task.contextColor}`, color: task.contextColor, padding: '4px 10px', fontSize: '9px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer', textTransform: 'uppercase' }}>
                                  {task.taskType === 'DOCUMENT_REVIEW' ? 'REVIEW DOC' : task.taskType === 'APPROVAL' ? 'APPROVE' : task.taskType === 'FOLLOW_UP' ? 'SEND MESSAGE' : task.taskType === 'VENDOR_CHASE' ? 'CHASE' : task.taskType === 'BLOCKER' ? 'ESCALATE' : 'UPDATE'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
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
                                <span style={{ fontSize: '9px', textTransform: 'uppercase', border: `1px solid ${req.contextColor}`, color: req.contextColor, borderRadius: '3px', padding: '2px 6px' }}>{req.context}</span>
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
                                      signalSource: `Assigned by ${req.assignedBy} `
                                    };
                                    setTodayTasks([...todayTasks, newTask]);
                                    setNewRequests(newRequests.filter(r => r.id !== req.id));
                                    setToast({ type: 'success', message: 'Task accepted · Added to today\'s work' });
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
                              {backlogTasks.slice(0, backlogVisible).map((task, idx) => (
                                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: idx < Math.min(backlogVisible, backlogTasks.length) - 1 ? '1px solid #1E2028' : 'none', background: '#0C0E14' }}>
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
                                Showing {Math.min(backlogVisible, backlogTasks.length)} of {backlogCount} &middot; Sort by: 
                                <span style={{ color: backlogSort === 'Staleness' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Staleness'); }}>Staleness</span> / 
                                <span style={{ color: backlogSort === 'Project' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Project'); }}>Project</span> / 
                                <span style={{ color: backlogSort === 'Priority' ? '#3D7EF8' : '#4A4D61', cursor: 'pointer', margin: '0 4px' }} onClick={(e) => { e.stopPropagation(); setBacklogSort('Priority'); }}>Priority</span>
                              </div>

                              {backlogVisible < backlogTasks.length && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBacklogVisible(prev => 
                                      Math.min(prev + 5, backlogTasks.length));
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    padding: '9px',
                                    border: '1px dashed #262933',
                                    borderRadius: '3px',
                                    fontFamily: 'monospace',
                                    fontSize: '10px',
                                    color: '#3D7EF8',
                                    cursor: 'pointer',
                                    marginTop: '4px',
                                    background: 'transparent'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#0D0F15';
                                    e.currentTarget.style.borderColor = '#3D7EF8';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = '#262933';
                                  }}
                                >
                                  Load 5 more ↓
                                </div>
                              )}
                              
                              {backlogVisible >= backlogTasks.length && (
                                <div className="mono" style={{
                                  textAlign: 'center', padding: '9px',
                                  fontSize: '10px', color: '#4A4D61'
                                }}>
                                  All {backlogTasks.length} tasks shown
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {currentMode === 'PORTFOLIO' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 150ms ease-in forwards' }}>
                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>KPI ALERTS</span>
                          <span style={{ fontSize: '10px', color: COLORS.textMuted, marginLeft: '8px' }}>Variance outside tolerance thresholds</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid ${COLORS.red}` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>NEBULA SAAS</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.red }}>↓7.1% vs Plan</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>NDR slipped below 110% floor</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Action: Review churn analysis by end of week
                          </div>
                        </div>

                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>ACME CORP</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.amber }}>↑1.2% over Target</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>EBITDA margin tightening</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Signal: Q1 closing costs pushed to Q2
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>VALUE CREATION MILESTONES</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid ${COLORS.green}` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>OPTIMA LOGISTICS</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.green }}>Completed</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>CFO Transition Complete</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            New hire starts Monday &middot; Onboarding plan is approved
                          </div>
                        </div>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>NEBULA SAAS</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.mono }}>In Progress</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>Pricing format overhaul</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Action: Review competitive tiering matrix with management
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>BOARD PREPARATION</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid ${COLORS.amber}` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>PROJECT TITAN</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.mono }}>12 Days Out</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>Board deck is 60% complete</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Missing: Financials appendencies &middot; Management update
                          </div>
                        </div>

                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>ACME CORP</span>
                             </div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.mono }}>28 Days Out</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>Schedule Q2 alignment touchpoint</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Action: Book 30min with CEO to review draft narrative
                          </div>
                        </div>
                      </div>
                      
                      <div className="mono" style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#4A4D61' }}>
                        No further items in window
                      </div>
                    </section>
                  </div>
                )}

                {currentMode === 'SOURCING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 150ms ease-in forwards' }}>
                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>ORIGINATION SIGNALS</span>
                          <span style={{ fontSize: '10px', color: COLORS.textMuted, marginLeft: '8px' }}>High-conviction triggers in market</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid ${COLORS.blue}` }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                             <div>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.blue}`, color: COLORS.blue, padding: '1px 4px', borderRadius: '2px' }}>RELATIONSHIP</span>
                               <span style={{ color: COLORS.textMuted, margin: '0 4px' }}>&middot;</span>
                               <span style={{ fontSize: '9px', border: `1px solid ${COLORS.textSecondary}`, color: COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>MERIDIAN HEALTHCARE</span>
                             </div>
                              <span className="mono" style={{ fontSize: '10px', color: COLORS.mono }}>Target Fit: 82</span>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: COLORS.textPrimary, marginBottom: '6px' }}>Activate introduction via Sarah J.</div>
                          <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                            Signal: Meridian CEO connected with Sarah J. on LinkedIn &middot; Historical co-investor match
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button onClick={() => setModal({ type: 'DRAFT_INTRO' })} style={{ background: COLORS.blue, color: '#fff', border: 'none', padding: '6px 12px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>Draft Intro Email</button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>THESIS MONITORING</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Supply Chain Tech Rollup</span>
                              <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>3 active targets &middot; 12 watching</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '11px', color: COLORS.green }}>+12% vs prior quarter</span>
                            </div>
                          </div>
                        </div>

                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Healthcare IT Mid-Market</span>
                              <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>1 active target &middot; 8 watching</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '11px', color: COLORS.red }}>-4% vs prior quarter</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>PIPELINE</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.green }}></div>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Vantage Infrastructure</span>
                            </div>
                            <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>Added 2d ago</span>
                          </div>
                        </div>

                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.blue }}></div>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Nexus Analytics</span>
                            </div>
                            <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>Mkt Map Review</span>
                          </div>
                        </div>
                        
                        <div className="card-default" style={{ padding: '14px', borderLeft: `3px solid transparent` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS.borderDefault }}></div>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Quantum Logistics</span>
                            </div>
                            <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>Intro Call Set</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mono" style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#4A4D61' }}>
                        No further items in window
                      </div>
                    </section>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* ================== STATE 2: DEAL DETAIL ================== */
            <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
               {/* Header */}
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '48px', borderBottom: `1px solid ${COLORS.borderSubtle}`, position: 'sticky', top: 0, background: COLORS.bg, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                    {selectedDeal.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: COLORS.textPrimary }}>{selectedDeal.name}</span>
                  <span className="mono" style={{ fontSize: '13px', color: COLORS.textSecondary }}>$1.4B</span>
                  <span style={{ fontSize: '10px', color: COLORS.textSecondary, border: `1px solid ${COLORS.borderDefault}`, borderRadius: '999px', padding: '1px 6px' }}>{selectedDeal.stage}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div onClick={() => setToast({ type: 'success', message: `Opened ${selectedDeal.name} record in Salesforce` })} style={{ fontSize: '10px', color: COLORS.textMuted, border: `1px solid ${COLORS.borderDefault}`, padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}>Open CRM &nearr;</div>
                   <div style={{ cursor: 'pointer', color: COLORS.textSecondary }} onClick={() => setSelectedDealId(null)}>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </div>
                </div>
              </div>

              {/* Stage Progression */}
              <div style={{ height: '56px', borderBottom: `1px solid ${COLORS.borderSubtle}`, padding: '0 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Stage 1 Completed */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: COLORS.blue }}>SOURCING</span>
                    </div>
                    <div style={{ width: '24px', height: '1px', background: COLORS.blue }}></div>
                    {/* Stage 2 Completed */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: COLORS.blue }}>DUE DILIGENCE</span>
                    </div>
                    <div style={{ width: '24px', height: '1px', background: COLORS.blue }}></div>
                    {/* Stage 3 Current */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 'bold' }}>3</div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: COLORS.textPrimary }}>EXECUTION</span>
                      <span style={{ fontSize: '9px', color: COLORS.green, border: `1px solid ${COLORS.green}`, padding: '0 4px', borderRadius: '2px' }}>ACTIVE</span>
                    </div>
                    <div style={{ width: '24px', height: '1px', background: COLORS.borderDefault }}></div>
                    {/* Stage 4 Future */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `1px solid ${COLORS.borderDefault}` }}></div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: COLORS.textMuted }}>PORTFOLIO</span>
                    </div>
                 </div>
                 <div className="mono" style={{ fontSize: '10px', color: COLORS.purple, marginTop: '6px' }}>
                   Stage health: 2 blockers detected &middot; Est. 3 weeks to close
                 </div>
              </div>

              {/* Two Column Content */}
              <div style={{ display: 'flex', flex: 1, padding: '20px 16px', gap: '24px' }}>
                 
                 {/* Left Col */}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <section>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase' }}>DEAL ACTIONS</span>
                        <div onClick={() => {
                          if (dealTasksGen) return;
                          setGeneratingTasks(true);
                          setTimeout(() => {
                            setGeneratingTasks(false);
                            setDealTasksGen(true);
                            setDealTasksData(prev => [
                              { id: 'tk1', title: 'Follow up on SPA terms', urgency: 'CRITICAL', owner: 'SJ', due: 'Tomorrow', bg: COLORS.red, type: 'FOLLOW_UP', status: 'NOT STARTED', signal: 'SPA terms reviewed by counterparty counsel 4 days ago. No response to clause 8.3 amendment request.', source: 'Email thread · 4 days ago', time: null },
                              { id: 'tk2', title: 'Chase diligence vendor on delays', urgency: 'WARNING', owner: 'AW', due: 'Today', bg: COLORS.amber, type: 'VENDOR_CHASE', status: 'NOT STARTED', signal: 'Diligence vendor last responded 3 days ago. Background check on 2 directors still outstanding.', source: 'Email thread · Detected 3h ago', time: null },
                              { id: 'tk3', title: 'Review lender covenant package', urgency: 'PLANNED', owner: 'MD', due: 'Friday', bg: COLORS.blue, type: 'DOCUMENT_REVIEW', status: 'NOT STARTED', signal: 'Covenant package covers 3 facilities. Interest coverage ratio set at 3.5×.', source: 'Financial Model · Detected 12h ago', time: null },
                              { id: 'tk4', title: 'Draft revised management rollover', urgency: 'PLANNED', owner: 'SJ', due: 'Next Week', bg: COLORS.blue, type: 'DOCUMENT_REVIEW', status: 'NOT STARTED', signal: null, source: 'Last activity: 2 days ago · DealCloud', time: null },
                              ...prev
                            ]);
                            setToast({ type: 'success', message: '4 tasks generated and assigned from recent intelligence' });
                          }, 1800);
                        }} style={{ fontSize: '10px', color: COLORS.textMuted, border: `1px solid ${COLORS.borderDefault}`, padding: '4px 8px', borderRadius: '3px', cursor: dealTasksGen ? 'default' : 'pointer', opacity: dealTasksGen ? 0.5 : 1 }}>
                          {generatingTasks ? 'Generating...' : dealTasksGen ? 'Added 4 tasks' : 'Generate Tasks'}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[...dealTasksData].sort((a, b) => (a.status === 'DONE' ? 1 : 0) - (b.status === 'DONE' ? 1 : 0)).map((t, i) => {
                          const isExpanded = dealTasksExp === t.id;
                          const isDone = t.status === 'DONE';
                          const borderColor = isDone ? '#2EBD85' : t.bg;
                          const titleColor = isDone ? '#4A4D61' : COLORS.textPrimary;
                          
                          let btnLabel = '';
                          let btnStyle: any = {};
                          if (t.type === 'FOLLOW_UP') { btnLabel = 'Draft Follow-up →'; btnStyle = { background: '#3D7EF8', color: '#fff' }; }
                          else if (t.type === 'VENDOR_CHASE') { btnLabel = 'Compose Chase →'; btnStyle = { background: '#E8943A', color: '#080A0F' }; }
                          else if (t.type === 'DOCUMENT_REVIEW') { btnLabel = 'Review Now →'; btnStyle = { background: '#2EBD85', color: '#080A0F' }; }
                          else if (t.type === 'BLOCKER') { btnLabel = 'Escalate →'; btnStyle = { background: 'transparent', border: '1px solid #E03E3E', color: '#E03E3E' }; }
                          else if (t.type === 'APPROVAL') { btnLabel = 'Sign Off →'; btnStyle = { background: '#8B7CF6', color: '#fff' }; }

                          const markDone = (act: string, msg: string) => {
                            setDealTasksExp(null);
                            setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'DONE', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) } : pt));
                            setToast({ type: 'success', message: msg });
                          };

                          return (
                            <div key={`new-${t.id}`} className="card-default" style={{ borderLeft: `3px solid ${borderColor}`, transition: 'all 300ms ease-out', animation: 'fadeIn 200ms ease-out forwards', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <div style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div>
                                    <div style={{ marginBottom: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                      <span style={{ fontSize: '9px', border: `1px solid ${borderColor}`, color: borderColor, padding: '1px 4px', borderRadius: '2px' }}>{t.urgency}</span>
                                      {t.isNew && (
                                        <span style={{ fontSize: '9px', border: '1px solid #3D7EF8', color: '#3D7EF8', padding: '1px 4px', borderRadius: '2px', animation: 'fadeOut 4s forwards' }}>NEW</span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: titleColor, marginBottom: '6px', transition: 'color 300ms' }}>{t.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <span style={{ fontSize: '10px', color: COLORS.textMuted }}>Owner: {t.owner}</span>
                                      <span style={{ color: COLORS.textMuted, margin: '0 4px' }}>&middot;</span>
                                      <span style={{ fontSize: '10px', color: COLORS.textSecondary }}>{t.due}</span>
                                      {t.status === 'ESCALATED' && (
                                        <span style={{ marginLeft: '8px', fontSize: '9px', border: `1px solid #E03E3E`, color: '#E03E3E', padding: '1px 4px', borderRadius: '2px' }}>ESCALATED → SJ</span>
                                      )}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: '9px', border: t.status === 'IN PROGRESS' ? `1px solid ${COLORS.blue}` : `1px solid ${COLORS.borderDefault}`, color: t.status === 'IN PROGRESS' ? COLORS.blue : COLORS.textSecondary, padding: '1px 4px', borderRadius: '2px' }}>{t.status}</span>
                                </div>
                              </div>
                              
                              {/* Footer */}
                              <div style={{ borderTop: '1px solid #1E2028', padding: '10px 14px', background: '#0D0F15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                  {t.signal ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                      <span style={{ fontSize: '9px', color: '#8B7CF6', fontFamily: 'JetBrains Mono, monospace' }}>⚡ Signal detected</span>
                                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: t.bg, flexShrink: 0 }}></div>
                                      <span className="mono" style={{ fontSize: '11px', color: '#8B8FA8', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.signal.substring(0, 70)}...</span>
                                    </div>
                                  ) : (
                                    <span className="mono" style={{ fontSize: '11px', color: '#4A4D61' }}>{t.source}</span>
                                  )}
                                </div>
                                <div style={{ flexShrink: 0, marginLeft: '12px' }}>
                                  {isDone ? (
                                    <span className="mono" style={{ fontSize: '10px', color: '#2EBD85' }}>Completed &middot; {t.time}</span>
                                  ) : (
                                    <button onClick={() => { 
                                        if (t.status === 'NOT STARTED') {
                                          setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'IN PROGRESS' } : pt));
                                        }
                                        setDealTasksExp(isExpanded ? null : t.id); 
                                    }} style={{ ...btnStyle, fontSize: '11px', fontWeight: 600, padding: '6px 14px', borderRadius: '3px', cursor: 'pointer', border: btnStyle.border || 'none' }}>
                                      {btnLabel}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Expansions */}
                              {isExpanded && t.type === 'FOLLOW_UP' && (
                                <div style={{ background: '#0C0E14', borderTop: '1px solid #1E2028', padding: '14px' }}>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '4px' }}>LAST COMMUNICATION</div>
                                    <div className="mono" style={{ fontSize: '11px', color: '#8B8FA8', marginBottom: '4px' }}>{t.signal}</div>
                                    <div className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>Source: {t.source}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '6px' }}>AI DRAFT</div>
                                    <textarea defaultValue={t.draftCopy || ''} style={{ background: '#111318', border: '1px solid #262933', borderRadius: '3px', padding: '10px 12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', lineHeight: 1.6, width: '100%', resize: 'none', outline: 'none' }} rows={3} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                     <div style={{ display: 'flex', gap: '8px' }}>
                                       <button onClick={() => markDone('SEND', 'Follow-up sent')} style={{ background: '#3D7EF8', color: '#fff', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>SEND VIA OUTLOOK &nearr;</button>
                                       <button onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(t.draftCopy || ''); } setToast({ type: 'success', message: 'Draft copied to clipboard' }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>COPY</button>
                                     </div>
                                     <div onClick={() => setDealTasksExp(null)} style={{ fontSize: '10px', color: '#4A4D61', cursor: 'pointer' }}>DISMISS</div>
                                  </div>
                                </div>
                              )}

                              {isExpanded && t.type === 'VENDOR_CHASE' && (
                                <div style={{ background: '#0C0E14', borderTop: '1px solid #1E2028', padding: '14px' }}>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '4px' }}>LAST COMMUNICATION</div>
                                    <div className="mono" style={{ fontSize: '11px', color: '#8B8FA8', marginBottom: '4px' }}>{t.signal}</div>
                                    <div className="mono" style={{ fontSize: '10px', color: '#4A4D61' }}>Source: {t.source}</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '6px' }}>AI DRAFT</div>
                                    <textarea defaultValue={t.draftCopy || ''} style={{ background: '#111318', border: '1px solid #262933', borderRadius: '3px', padding: '10px 12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', lineHeight: 1.6, width: '100%', resize: 'none', outline: 'none' }} rows={3} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                     <div style={{ display: 'flex', gap: '8px' }}>
                                       <button onClick={() => markDone('SEND', 'Vendor chase sent')} style={{ background: '#E8943A', color: '#080A0F', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>SEND VIA OUTLOOK &nearr;</button>
                                       <button onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(t.draftCopy || ''); } setToast({ type: 'success', message: 'Draft copied to clipboard' }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>COPY</button>
                                     </div>
                                     <div onClick={() => setDealTasksExp(null)} style={{ fontSize: '10px', color: '#4A4D61', cursor: 'pointer' }}>DISMISS</div>
                                  </div>
                                </div>
                              )}

                              {isExpanded && t.type === 'DOCUMENT_REVIEW' && (
                                <div style={{ background: '#0C0E14', borderTop: '1px solid #1E2028', padding: '14px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ width: '12px', height: '12px', background: t.docColor || '#3D7EF8', borderRadius: '2px' }}></div>
                                      <div style={{ fontSize: '13px', color: '#E8EAF0', fontWeight: 500 }}>{t.docName || 'Document.pdf'}</div>
                                    </div>
                                    {t.docTag && <span style={{ fontSize: '9px', border: `1px solid ${t.docColor || COLORS.amber}`, color: t.docColor || COLORS.amber, padding: '1px 4px', borderRadius: '2px' }}>{t.docTag}</span>}
                                  </div>
                                  
                                  {t.aiSummary && (
                                    <div style={{ background: '#0D0F15', borderLeft: '2px solid #8B7CF6', padding: '10px 12px', marginBottom: '16px', borderRadius: '0 3px 3px 0' }}>
                                      <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '6px' }}>AI SUMMARY</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {t.aiSummary.map((point: string, idx: number) => (
                                          <div key={idx} style={{ display: 'flex', gap: '6px' }}><span style={{ color: '#8B8FA8' }}>&middot;</span><span style={{ fontSize: '12px', color: '#8B8FA8' }}>{point}</span></div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <button onClick={() => setToast({ type: 'info', message: `Opening ${t.docName || 'document'} in document viewer \u2197` })} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>OPEN FILE &nearr;</button>
                                    <button onClick={() => markDone('APPROVE', 'Reviewed successfully')} style={{ background: '#2EBD85', color: '#080A0F', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>MARK REVIEWED ✓</button>
                                    <button onClick={() => {
                                      setDealTasksExp(null);
                                      setDealTasksData(prev => [
                                        ...prev,
                                        { id: `t${Date.now()}`, title: `Discuss ${t.title} issue`, urgency: 'CRITICAL', owner: 'SJ', due: 'Today', bg: COLORS.red, type: 'BLOCKER', status: 'NOT STARTED', signal: 'Issue flagged during document review.', source: 'Document Review', time: null }
                                      ]);
                                      setToast({ type: 'warning', message: 'Issue flagged and escalated to deal team' });
                                    }} style={{ background: 'transparent', color: '#E03E3E', border: '1px solid #E03E3E', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>FLAG ISSUE</button>
                                    <div onClick={() => setDealTasksExp(null)} style={{ fontSize: '11px', color: '#4A4D61', cursor: 'pointer', marginLeft: 'auto' }}>DISMISS</div>
                                  </div>
                                </div>
                              )}

                              {isExpanded && t.type === 'BLOCKER' && (
                                <div style={{ background: '#0C0E14', borderTop: '1px solid #1E2028', padding: '14px' }}>
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#4A4D61', marginBottom: '4px' }}>ESCALATE TO</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#111318', padding: '8px 12px', borderRadius: '3px', border: '1px solid #3D7EF8' }}>
                                        <input type="radio" name={`esc-${t.id}`} defaultChecked style={{ accentColor: '#3D7EF8' }} />
                                        <span style={{ fontSize: '12px', color: '#E8EAF0' }}>Sarah J. (VP)</span>
                                      </label>
                                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#0D0F15', padding: '8px 12px', borderRadius: '3px', border: '1px solid #262933' }}>
                                        <input type="radio" name={`esc-${t.id}`} style={{ accentColor: '#3D7EF8' }} />
                                        <span style={{ fontSize: '12px', color: '#E8EAF0' }}>Alex W. (Associate)</span>
                                      </label>
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B7CF6', marginBottom: '6px' }}>CONTEXT TO SHARE</div>
                                    <textarea defaultValue={t.signal || "Issue that requires immediate escalation."} style={{ background: '#111318', border: '1px solid #262933', borderRadius: '3px', padding: '10px 12px', fontSize: '12px', color: '#E8EAF0', fontFamily: 'Inter', lineHeight: 1.6, width: '100%', resize: 'none', outline: 'none' }} rows={3} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                     <button onClick={() => {
                                        setDealTasksExp(null);
                                        setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'ESCALATED' } : pt));
                                        setToast({ type: 'warning', message: 'Blocker escalated to Sarah J. · Context and deal data shared' });
                                     }} style={{ background: '#E03E3E', color: '#fff', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>ESCALATE NOW</button>
                                     <div onClick={() => setDealTasksExp(null)} style={{ fontSize: '10px', color: '#4A4D61', cursor: 'pointer' }}>CANCEL</div>
                                  </div>
                                </div>
                              )}

                              {isExpanded && t.type === 'APPROVAL' && (
                                <div style={{ background: '#0C0E14', borderTop: '1px solid #1E2028', padding: '14px' }}>
                                  <div style={{ fontSize: '12px', color: '#E8EAF0', marginBottom: '16px' }}>{t.title} requires your sign off to trigger the next stage.</div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => markDone('APPROVE', 'Sign-off complete')} style={{ background: '#8B7CF6', color: '#fff', border: 'none', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>APPROVE</button>
                                    <button onClick={() => { setDealTasksExp(t.id); setToast({ type: 'warning', message: `Changes requested \u00B7 ${t.owner} will be notified` }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>REQUEST CHANGES</button>
                                    <button onClick={() => { setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, status: 'NOT_STARTED' } : pt)); setToast({ type: 'info', message: `Deferred \u00B7 ${t.title} moved to tomorrow` }); }} style={{ background: 'transparent', color: '#E8EAF0', border: '1px solid #262933', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '3px', cursor: 'pointer' }}>DEFER</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>DEAL INTELLIGENCE</div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {((selectedDeal as any).intelligence || []).map((insight: any, idx: number) => (
                           <div key={idx} style={{ padding: '12px 0', borderBottom: `1px solid ${COLORS.borderSubtle}`, display: 'flex', gap: '12px' }}>
                             <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: insight.color, marginTop: '6px', flexShrink: 0 }}></div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>{insight.text}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>{insight.source}</div>
                                  <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                    <span onClick={() => {
                                      setModal({ type: 'ADD_TASK', data: { title: 'Review signal', context: insight.text, urgency: 'WATCH', dealName: selectedDeal?.name } });
                                    }} style={{ fontSize: '10px', color: '#3D7EF8', cursor: 'pointer' }}>&rarr; Create task</span>
                                    <span onClick={() => {
                                      setIntelligenceLinkTarget(intelligenceLinkTarget === idx.toString() ? null : idx.toString());
                                    }} style={{ fontSize: '10px', color: '#4A4D61', cursor: 'pointer' }}>&rarr; Link to existing</span>
                                    
                                    {intelligenceLinkTarget === idx.toString() && (
                                       <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '4px', background: '#0C0E14', border: '1px solid #262933', borderRadius: '3px', padding: '6px', width: '220px', zIndex: 10 }}>
                                         <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#8B8FA8', marginBottom: '6px', padding: '0 4px' }}>OPEN TASKS</div>
                                         <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                           {dealTasksData.filter(t => t.status !== 'DONE').map(t => {
                                             const isMatch = t.id === insight.linkedTaskId;
                                             return (
                                               <div key={`link-${t.id}`} onClick={() => {
                                                 setDealTasksData(prev => prev.map(pt => pt.id === t.id ? { ...pt, signal: insight.text } : pt));
                                                 setIntelligenceLinkTarget(null);
                                                 setToast({ type: 'info', message: `Signal linked to ${t.title} · Context added` });
                                               }} style={{ fontSize: '11px', color: isMatch ? '#E8EAF0' : '#8B8FA8', padding: '6px 4px', cursor: 'pointer', borderRadius: '2px', background: isMatch ? 'rgba(61, 126, 248, 0.1)' : 'transparent', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                                 {t.title}
                                               </div>
                                             );
                                           })}
                                         </div>
                                       </div>
                                    )}
                                  </div>
                                </div>
                             </div>
                           </div>
                        ))}
                      </div>
                    </section>

                 </div>

                 {/* Right Col */}
                 <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    <section>
                      <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>DOCUMENTS</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {((selectedDeal as any).documents || []).map((doc: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                 <div style={{ width: '12px', height: '14px', background: doc.color, opacity: 0.8, borderRadius: '2px', flexShrink: 0 }}></div>
                                 <div style={{ fontSize: '12px', color: COLORS.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                               </div>
                               <span style={{ fontSize: '9px', border: `1px solid ${doc.tagColor}`, color: doc.tagColor, padding: '1px 4px', borderRadius: '2px', whiteSpace: 'nowrap', marginLeft: '8px' }}>{doc.tag}</span>
                             </div>
                             <div className="mono" style={{ fontSize: '10px', color: COLORS.textMuted, paddingLeft: '20px' }}>Updated {doc.updatedAgo} by {doc.updatedBy}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>DEAL TEAM</div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {((selectedDeal as any).team || []).map((initials: string, idx: number) => (
                           <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                             <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1C1F28', border: `1px solid ${COLORS.borderDefault}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: COLORS.textPrimary }}>{initials}</div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>{(selectedDeal as any).teamLastActive?.[idx] || 'recently'}</span>
                           </div>
                        ))}
                        {addedMembers.map((member, idx) => (
                           <div key={`added-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                             <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: COLORS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', animation: 'scaleIn 200ms ease-out forwards' }}>{member.split(' ').map((n: string) => n[0]).join('')}</div>
                             <span className="mono" style={{ fontSize: '10px', color: COLORS.blue }}>now</span>
                           </div>
                        ))}
                        <div onClick={() => setSlidePanel({ type: 'ADD_MEMBER', data: { dealName: selectedDeal?.name } })} style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px dashed ${COLORS.borderDefault}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textMuted, cursor: 'pointer' }}>+</div>
                      </div>
                    </section>

                 </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* --- RIGHT PANEL --- */}
      <aside style={{ width: '25vw', flexShrink: 0, minWidth: '200px', overflow: 'hidden', backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          
          {/* Top Section */}
          <section>
             <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '16px' }}>
               {currentMode === 'EXECUTION' ? "TODAY'S INTELLIGENCE" :
                currentMode === 'PORTFOLIO' ? "PORTFOLIO SIGNALS" :
                "MARKET INTELLIGENCE"}
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', animation: 'fadeIn 150ms ease-in forwards' }}>
                {currentMode === 'EXECUTION' && [
                  { dot: COLORS.red, t: 'Nebula SaaS counterparty has not responded in 48 hours. Risk of diligence stall is elevated.', src: 'Source: Email thread · Detected 2h ago' },
                  { dot: COLORS.amber, t: 'Project Titan revenue model does not align with Q3 actuals. Variance is 14%.', src: 'Source: Financial Model · Detected 4h ago' },
                  { dot: COLORS.blue, t: 'Acme Corp legal review completion expected by 6pm based on document velocity.', src: 'Source: VDR Activity · Detected 5h ago' }
                ].map((item, idx) => (
                  <div 
                  key={idx} 
                  onClick={() => {
                    let targetDealId = null;
                    if (item.t.includes('Nebula SaaS')) targetDealId = 'nebula';
                    else if (item.t.includes('Project Titan')) targetDealId = 'titan';
                    else if (item.t.includes('Acme Corp')) targetDealId = 'acme';
                    else if (item.t.includes('Optima Logistics')) targetDealId = 'optima';
                    else if (item.t.includes('Meridian Healthcare')) targetDealId = 'meridian';
                    else if (item.t.includes('Vantage Infrastructure')) targetDealId = 'vantage';
                    
                    if (targetDealId) {
                        setSelectedDealId(targetDealId);
                        setToast({ type: 'info', message: 'Navigating to deal context...' });
                    } else {
                        setToast({ type: 'info', message: 'Opening intelligence detail...' });
                    }
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#111318')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  style={{ display: 'flex', cursor: 'pointer', transition: 'background 0.2s', gap: '12px', borderBottom: `1px solid ${COLORS.borderSubtle}`, padding: '12px 8px', margin: '0 -8px', borderRadius: '4px' }}
                >
                     <div style={{ width: '3px', background: item.dot, flexShrink: 0 }}></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div style={{ fontSize: '12px', color: COLORS.textPrimary, lineHeight: 1.4 }}>{item.t}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>{item.src}</span>
                          <span style={{ color: COLORS.textMuted }}>&rsaquo;</span>
                        </div>
                     </div>
                  </div>
                ))}

                {currentMode === 'PORTFOLIO' && [
                  { dot: COLORS.blue, t: 'Optima Logistics CFO onboarding is ahead of schedule.', src: 'Source: Deal Team · Detected 1h ago' },
                  { dot: COLORS.red, t: 'Nebula SaaS Q2 churn spiked in EMEA region.', src: 'Source: BI Dashboard · Detected 3h ago' },
                  { dot: COLORS.amber, t: 'Project Titan board materials missing key financial appendix.', src: 'Source: Drive Folder · Detected 5h ago' }
                ].map((item, idx) => (
                  <div 
                  key={idx} 
                  onClick={() => {
                    let targetDealId = null;
                    if (item.t.includes('Nebula SaaS')) targetDealId = 'nebula';
                    else if (item.t.includes('Project Titan')) targetDealId = 'titan';
                    else if (item.t.includes('Acme Corp')) targetDealId = 'acme';
                    else if (item.t.includes('Optima Logistics')) targetDealId = 'optima';
                    else if (item.t.includes('Meridian Healthcare')) targetDealId = 'meridian';
                    else if (item.t.includes('Vantage Infrastructure')) targetDealId = 'vantage';
                    
                    if (targetDealId) {
                        setSelectedDealId(targetDealId);
                        setToast({ type: 'info', message: 'Navigating to deal context...' });
                    } else {
                        setToast({ type: 'info', message: 'Opening intelligence detail...' });
                    }
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#111318')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  style={{ display: 'flex', cursor: 'pointer', transition: 'background 0.2s', gap: '12px', borderBottom: `1px solid ${COLORS.borderSubtle}`, padding: '12px 8px', margin: '0 -8px', borderRadius: '4px' }}
                >
                     <div style={{ width: '3px', background: item.dot, flexShrink: 0 }}></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div style={{ fontSize: '12px', color: COLORS.textPrimary, lineHeight: 1.4 }}>{item.t}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>{item.src}</span>
                          <span style={{ color: COLORS.textMuted }}>&rsaquo;</span>
                        </div>
                     </div>
                  </div>
                ))}

                {currentMode === 'SOURCING' && [
                  { dot: COLORS.green, t: 'Meridian Healthcare CEO active on LinkedIn, engaged with recent firm post.', src: 'Source: Social Graph · Detected 45m ago' },
                  { dot: COLORS.blue, t: 'Competitor fund raised new $500M vehicle targeting logistics.', src: 'Source: Pitchbook · Detected 2h ago' },
                  { dot: COLORS.amber, t: 'Vantage Infrastructure CFO spoke on panel about capital needs.', src: 'Source: Web Scrape · Detected 1d ago' }
                ].map((item, idx) => (
                  <div 
                  key={idx} 
                  onClick={() => {
                    let targetDealId = null;
                    if (item.t.includes('Nebula SaaS')) targetDealId = 'nebula';
                    else if (item.t.includes('Project Titan')) targetDealId = 'titan';
                    else if (item.t.includes('Acme Corp')) targetDealId = 'acme';
                    else if (item.t.includes('Optima Logistics')) targetDealId = 'optima';
                    else if (item.t.includes('Meridian Healthcare')) targetDealId = 'meridian';
                    else if (item.t.includes('Vantage Infrastructure')) targetDealId = 'vantage';
                    
                    if (targetDealId) {
                        setSelectedDealId(targetDealId);
                        setToast({ type: 'info', message: 'Navigating to deal context...' });
                    } else {
                        setToast({ type: 'info', message: 'Opening intelligence detail...' });
                    }
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#111318')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  style={{ display: 'flex', cursor: 'pointer', transition: 'background 0.2s', gap: '12px', borderBottom: `1px solid ${COLORS.borderSubtle}`, padding: '12px 8px', margin: '0 -8px', borderRadius: '4px' }}
                >
                     <div style={{ width: '3px', background: item.dot, flexShrink: 0 }}></div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div style={{ fontSize: '12px', color: COLORS.textPrimary, lineHeight: 1.4 }}>{item.t}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="mono" style={{ fontSize: '10px', color: COLORS.textMuted }}>{item.src}</span>
                          <span style={{ color: COLORS.textMuted }}>&rsaquo;</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          <div style={{ height: '1px', background: COLORS.borderSubtle, width: '100%', margin: '20px 0' }}></div>

          {/* Bottom Section */}
          <section style={{ paddingBottom: '40px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '16px' }}>TIME INTELLIGENCE</div>
            
            <div style={{ marginBottom: '20px' }}>
              <div className="mono" style={{ fontSize: '18px', color: COLORS.textPrimary, marginBottom: '2px' }}>10:24 AM</div>
              <div style={{ fontSize: '10px', color: COLORS.textMuted }}>Monday, 25 April</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', borderLeft: `1px solid ${COLORS.borderDefault}`, marginLeft: '6px', paddingLeft: '16px' }}>
               
               {/* Event 1 (Past) */}
               <div style={{ position: 'relative' }}>
                 <div style={{ position: 'absolute', left: '-20.5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.borderDefault }}></div>
                 <div style={{ fontSize: '10px', color: COLORS.textMuted, marginBottom: '2px' }}>09:00–10:00</div>
                 <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>Review Term Sheet (Acme)</div>
                 <div style={{ fontSize: '9px', color: COLORS.textMuted, textTransform: 'uppercase' }}>DEEP WORK</div>
               </div>

               {/* Event 2 (Current) */}
               <div style={{ position: 'relative', borderLeft: `2px solid ${COLORS.blue}`, paddingLeft: '8px', marginLeft: '-17px' }}>
                 <div style={{ position: 'absolute', left: '-4.5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.blue, zIndex: 2 }}></div>
                 <div style={{ fontSize: '10px', color: COLORS.textPrimary, marginBottom: '2px' }}>10:00–11:00</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.textPrimary }}>Partner Deal Review</div>
                    <span style={{ fontSize: '9px', border: `1px solid ${COLORS.blue}`, color: COLORS.blue, padding: '1px 4px', borderRadius: '2px' }}>NOW</span>
                 </div>
                 <div style={{ fontSize: '9px', color: COLORS.textMuted, textTransform: 'uppercase' }}>CALL</div>
               </div>

               {/* Event 3 (Future) */}
               <div style={{ position: 'relative' }}>
                 <div style={{ position: 'absolute', left: '-20.5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', border: `1px solid ${COLORS.borderDefault}`, background: COLORS.bg }}></div>
                 <div style={{ fontSize: '10px', color: COLORS.textMuted, marginBottom: '2px' }}>11:30–12:00</div>
                 <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>Nebula Founder Call</div>
                 <div style={{ fontSize: '9px', color: COLORS.textMuted, textTransform: 'uppercase' }}>CALL</div>
               </div>

               {/* Event 4 (Future) */}
               <div style={{ position: 'relative' }}>
                 <div style={{ position: 'absolute', left: '-20.5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', border: `1px solid ${COLORS.borderDefault}`, background: COLORS.bg }}></div>
                 <div style={{ fontSize: '10px', color: COLORS.textMuted, marginBottom: '2px' }}>14:00–15:00</div>
                 <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>IC Committee Prep</div>
                 <div style={{ fontSize: '9px', color: COLORS.textMuted, textTransform: 'uppercase' }}>INTERNAL</div>
               </div>

               {hasScheduledTime && (
                 <div style={{ position: 'relative', marginTop: '-12px', borderLeft: '2px solid transparent', paddingLeft: '8px', animation: 'fadeInScheduled 2s ease-out forwards' }}>
                   <div style={{ position: 'absolute', left: '-5.5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', border: `1px solid ${COLORS.green}`, background: COLORS.bg }}></div>
                   <div style={{ fontSize: '10px', color: COLORS.textMuted, marginBottom: '2px', position: 'relative', top: '-1px' }}>Tomorrow &middot; 09:00–09:45</div>
                   <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>ARR Model Review</div>
                   <div style={{ fontSize: '9px', color: COLORS.textMuted, textTransform: 'uppercase' }}>DEEP WORK</div>
                 </div>
               )}
            </div>

            {/* AI Protected Block */}
            <div style={{ marginTop: '24px', padding: '10px', background: '#0C0E14', border: `1px dashed ${COLORS.borderDefault}`, borderRadius: '3px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={COLORS.purple} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                 <span style={{ fontSize: '9px', color: COLORS.purple, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI PROTECTED</span>
               </div>
               <div style={{ fontSize: '12px', color: COLORS.textPrimary, marginBottom: '4px' }}>IC Memo Review</div>
               <div className="mono" style={{ fontSize: '11px', color: COLORS.textSecondary, marginBottom: '6px' }}>14:00 &ndash; 15:30</div>
               <div style={{ fontSize: '10px', color: COLORS.textMuted }}>Cleared from meeting requests</div>
            </div>

          </section>

        </div>

        {/* Bottom Bar Fixed */}
        <div style={{ height: '40px', position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex' }}>
          <button onClick={() => setModal({ type: 'ADD_DEAL' })} style={{ flex: 1, background: '#111318', border: 'none', borderTop: `1px solid ${COLORS.borderSubtle}`, borderRight: `1px solid ${COLORS.borderSubtle}`, color: COLORS.textSecondary, fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}>+ DEAL</button>
          <button onClick={() => setModal({ type: 'ADD_TASK', data: { dealName: selectedDeal?.name } })} style={{ flex: 1, background: '#111318', border: 'none', borderTop: `1px solid ${COLORS.borderSubtle}`, color: COLORS.textSecondary, fontSize: '10px', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}>+ TASK</button>
        </div>
      </aside>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080A0F', color: '#4A4D61' }}>
           <div style={{ padding: '24px', border: '1px solid #1E2028', borderRadius: '4px', textAlign: 'center', background: '#0D0F15' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px auto', color: '#3D7EF8', display: 'block' }}>
               <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
               <line x1="3" y1="9" x2="21" y2="9"></line>
               <line x1="9" y1="21" x2="9" y2="9"></line>
             </svg>
             <div style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0', marginBottom: '8px' }}>{activeModule} Module</div>
             <div style={{ fontSize: '12px' }}>This module is currently under development.</div>
             <button onClick={() => setActiveModule('HOME')} style={{ marginTop: '16px', background: 'transparent', border: '1px solid #3D7EF8', color: '#3D7EF8', padding: '6px 16px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>Return to OS Home</button>
           </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#181B22',
          border: '1px solid #262933',
          borderRadius: '4px',
          padding: '12px 20px',
          minWidth: '280px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          animation: 'toastIn 200ms ease-out forwards'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: toast.type === 'success' ? '#2EBD85' : toast.type === 'info' ? '#3D7EF8' : '#E8943A',
            borderTopLeftRadius: '3px',
            borderBottomLeftRadius: '3px'
          }}></div>
          <div style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: toast.type === 'success' ? '#2EBD85' : toast.type === 'info' ? '#3D7EF8' : '#E8943A',
          }}></div>
          <span style={{ fontSize: '13px', color: '#E8EAF0', fontFamily: 'Inter' }}>{toast.message}</span>
        </div>
      )}

      {/* OVERLAY RENDERERS (Placeholders for SlidePanel and Modal to be populated) */}
      {slidePanel && (
        <div 
          onClick={() => setSlidePanel(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 999 }} 
        />
      )}
      
      {slidePanel && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '320px', height: '100vh', zIndex: 1000,
          background: '#0C0E14', borderLeft: '1px solid #262933', boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
          animation: 'slideInRight 220ms ease-out forwards', display: 'flex', flexDirection: 'column'
        }}>
          <SlidePanelContent slidePanel={slidePanel} setSlidePanel={setSlidePanel} setToast={setToast} setDec1Owner={setDec1Owner} setDismissedCards={setDismissedCards} setAddedMembers={setAddedMembers} addedMembers={addedMembers} />
        </div>
      )}

      {modal && (
        <div 
          onClick={() => setModal(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111318', border: '1px solid #262933', borderRadius: '4px', width: '480px', maxHeight: '80vh', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)', animation: 'scaleIn 180ms ease-out forwards'
            }}>
            <ModalContent modal={modal} selectedDeal={selectedDeal} setModal={setModal} setToast={setToast} deals={deals} setDeals={setDeals} />
          </div>
        </div>
      )}

    </div>
  </div>
  );
}
