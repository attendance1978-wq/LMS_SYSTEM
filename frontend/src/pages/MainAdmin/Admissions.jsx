import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';
import { getStatusBadge, formatDate } from '../../utils/helpers';
import { CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MAAdmissions() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => MA.getEnrollments({ status: 'Pending' }).then(r => { setEnrollments(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const approve = async (id) => {
    try { await MA.approveEnrollment(id); toast.success('Enrollment approved'); load(); }
    catch { toast.error('Error'); }
  };
  return (
    <div>
      <div className="page-header">
        <div><h1>Admissions</h1><p>{enrollments.length} pending enrollment requests</p></div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Student ID</th><th>Course ID</th><th>School</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e.id}>
                    <td>Student #{e.student_id}</td>
                    <td>Course #{e.course_id}</td>
                    <td>School #{e.school_id}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(e.enrollment_date)}</td>
                    <td><span className={`badge ${getStatusBadge(e.status)}`}>{e.status}</span></td>
                    <td><button className="btn btn-success btn-sm" onClick={() => approve(e.id)}><CheckCircle size={13} /> Approve</button></td>
                  </tr>
                ))}
                {!enrollments.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No pending admissions</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
