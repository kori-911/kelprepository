const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const s1 = '{todayTasks.length === 0 ? (';
const s3 = ') : todayTasks.map(task => (';

const rep = `{filteredTasks.length === 0 ? (
                          (filters.priority || filters.type || filters.context) ? (
                            <div className="mono" style={{ padding: '16px 0 0 44px', fontSize: '11px', color: '#4A4D61' }}>
                              No tasks match this filter &middot; <span onClick={() => setFilters({ priority: null, type: null, context: null })} style={{ color: '#3D7EF8', cursor: 'pointer' }}>Clear filters</span>
                            </div>
                          ) : (
                            <div className="mono" style={{ padding: '14px', textAlign: 'center', fontSize: '11px', color: '#4A4D61' }}>Nothing here &middot; You're clear</div>
                          )
                        ) : filteredTasks.map(task => (`

const startIdx = code.indexOf(s1);
if (startIdx > -1) {
    const endIdx = code.indexOf('(', code.indexOf(s3)) + 1;
    code = code.substring(0, startIdx) + rep + code.substring(endIdx);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Replaced');
} else {
    console.log('Not found');
}
