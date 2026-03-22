import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';

export default function MAAcademicRecords() {
  const [data, setData] = useState({ total: 0, records: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { MA.getAcademicRecords().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <div>
      <div className="page-header"><div><h1>Academic Records</h1><p>Total: {data.total} records</p></div></div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" />Loading...</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Course</th><th>Year</th><th>Semester</th><th>Grade Level</th><th>Section</th><th>Status</th></tr></thead>
              <tbody>
                {data.records.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>#{r.student_id}</td>
                    <td>#{r.course_id}</td>
                    <td>{r.academic_year}</td>
                    <td>{r.semester}</td>
                    <td>{r.grade_level || '—'}</td>
                    <td>{r.section || '—'}</td>
                    <td><span className="badge badge-blue">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
