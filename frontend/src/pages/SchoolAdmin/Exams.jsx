import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { FileText } from 'lucide-react';

export default function SchExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { SAd.getExams().then(r => { setExams(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <div>
      <div className="page-header"><div><h1>Exams</h1><p>{exams.length} exams on record</p></div></div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Title</th><th>Course</th><th>Type</th><th>Date</th><th>Total Score</th><th>Passing</th><th>Published</th></tr></thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id}>
                    <td><strong>{e.title}</strong></td>
                    <td>#{e.course_id}</td>
                    <td><span className="badge badge-blue">{e.type}</span></td>
                    <td style={{ fontSize:12 }}>{formatDate(e.exam_date)}</td>
                    <td>{e.total_score}</td>
                    <td>{e.passing_score}</td>
                    <td><span className={`badge ${e.is_published ? 'badge-green' : 'badge-yellow'}`}>{e.is_published ? 'Published' : 'Draft'}</span></td>
                  </tr>
                ))}
                {!exams.length && <tr><td colSpan={7}><div className="empty-state"><FileText size={32}/><p>No exams yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
