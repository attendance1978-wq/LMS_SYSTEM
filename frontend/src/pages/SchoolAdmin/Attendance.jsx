import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { getStatusBadge, formatDate } from '../../utils/helpers';

export default function SchAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const load = (d) => SAd.getAttendance(d ? { date: d } : {}).then(r => { setRecords(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);
  return (
    <div>
      <div className="page-header">
        <div><h1>Attendance Records</h1></div>
        <input className="form-control" type="date" style={{ width:180 }} value={date} onChange={e => { setDate(e.target.value); load(e.target.value); }}/>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Date</th><th>Student</th><th>Course</th><th>Teacher</th><th>Status</th><th>Time In</th></tr></thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontSize:12 }}>{formatDate(r.date)}</td>
                    <td>#{r.student_id}</td>
                    <td>#{r.course_id}</td>
                    <td>#{r.teacher_id}</td>
                    <td><span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                    <td style={{ fontSize:12 }}>{r.time_in || '—'}</td>
                  </tr>
                ))}
                {!records.length && <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>No attendance records{date ? ` for ${formatDate(date)}` : ''}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
