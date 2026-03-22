import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { getStatusBadge, formatDate } from '../../utils/helpers';

export default function STAttendance() {
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { ST.getAttendance().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const { summary, records } = data;
  const pct = summary.total > 0 ? ((summary.present / summary.total) * 100) : 0;

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header"><div><h1>My Attendance</h1><p>Track your class attendance record</p></div></div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Sessions', value: summary.total, color: '#1e40af', bg: '#dbeafe' },
          { label: 'Present', value: summary.present, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Absent', value: summary.absent, color: '#dc2626', bg: '#fee2e2' },
          { label: 'Late', value: summary.late, color: '#d97706', bg: '#fef9c3' },
          { label: 'Excused', value: summary.excused, color: '#0369a1', bg: '#dbeafe' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value ?? 0}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Attendance rate bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Overall Attendance Rate</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: pct >= 75 ? '#16a34a' : '#dc2626' }}>{summary.rate || '0%'}</span>
        </div>
        <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct >= 75 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #dc2626, #ef4444)',
            borderRadius: 6, transition: 'width .6s ease',
          }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
          {pct >= 75 ? '✅ Good standing — meets the 75% minimum requirement' : '⚠️ Below 75% minimum attendance requirement'}
        </div>
      </div>

      {/* Records table */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Attendance Log</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Date</th><th>Course</th><th>Status</th><th>Time In</th><th>Remarks</th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td style={{ fontSize: 13 }}>{formatDate(r.date)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>Course #{r.course_id}</td>
                  <td><span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                  <td style={{ fontSize: 12 }}>{r.time_in || '—'}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.remarks || '—'}</td>
                </tr>
              ))}
              {!records.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No attendance records yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
