import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';
import { getStatusBadge, formatDate } from '../../utils/helpers';

export default function MAEnrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  useEffect(() => { MA.getEnrollments().then(r => { setEnrollments(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  const filtered = filter ? enrollments.filter(e => e.status === filter) : enrollments;
  return (
    <div>
      <div className="page-header">
        <div><h1>Enrollment Records</h1><p>All enrollment records across schools</p></div>
        <select className="form-control" style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          {['Pending','Enrolled','Dropped','Completed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Course</th><th>School</th><th>Academic Year</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>#{e.student_id}</td>
                    <td>#{e.course_id}</td>
                    <td>#{e.school_id}</td>
                    <td>{e.academic_year} — {e.semester}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(e.enrollment_date)}</td>
                    <td><span className={`badge ${getStatusBadge(e.status)}`}>{e.status}</span></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No records found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
