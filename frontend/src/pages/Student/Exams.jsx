import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { FileText } from 'lucide-react';

export default function STExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { ST.getExams().then(r => { setExams(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const graded = exams.filter(e => e.grade !== null);
  const avg = graded.length ? (graded.reduce((s, e) => s + (e.grade / e.total_score) * 100, 0) / graded.length).toFixed(1) : null;

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Exams & Grades</h1><p>{exams.length} exams this semester</p></div>
      </div>

      {/* Summary */}
      {graded.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0369a1' }}>{exams.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total Exams</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0f766e' }}>{graded.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Graded</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: parseFloat(avg) >= 75 ? '#16a34a' : '#dc2626' }}>{avg}%</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Average Score</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Type</th>
                <th>Course</th>
                <th>Date</th>
                <th style={{ textAlign: 'center' }}>Score</th>
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Percentage</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => {
                const pct = e.grade !== null ? ((e.grade / e.total_score) * 100).toFixed(1) : null;
                return (
                  <tr key={e.id}>
                    <td><strong>{e.title}</strong></td>
                    <td><span className="badge badge-blue">{e.type}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>#{e.course_id}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(e.exam_date)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 15 }}>
                      {e.grade !== null ? e.grade : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{e.total_score}</td>
                    <td style={{ textAlign: 'center' }}>
                      {pct ? (
                        <span style={{ fontWeight: 700, color: parseFloat(pct) >= (e.passing_score / e.total_score * 100) ? '#16a34a' : '#dc2626' }}>
                          {pct}%
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {e.grade !== null
                        ? <span className={`badge ${e.passed ? 'badge-green' : 'badge-red'}`}>{e.passed ? 'PASSED' : 'FAILED'}</span>
                        : <span className="badge badge-gray">Pending</span>
                      }
                    </td>
                  </tr>
                );
              })}
              {!exams.length && (
                <tr><td colSpan={8}>
                  <div className="empty-state"><FileText size={32} /><p>No exams yet this semester</p></div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
