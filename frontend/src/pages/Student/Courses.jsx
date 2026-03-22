import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { BookOpen } from 'lucide-react';

export default function STCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { ST.getCourses().then(r => { setCourses(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>My Courses</h1><p>{courses.length} courses enrolled this semester</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
        {courses.map(c => (
          <div key={c.id} className="card" style={{ borderLeft: '4px solid #0369a1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 15 }}>{c.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>{c.code}</div>
              </div>
              <span style={{
                background: '#dbeafe', color: '#1d4ed8',
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              }}>{c.units} units</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'grid', gap: 5 }}>
              {c.teacher_id && <div>👨‍🏫 Teacher #{c.teacher_id}</div>}
              {c.schedule && <div>🕐 {c.schedule}</div>}
              {c.room && <div>📍 Room {c.room}</div>}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
              <span className="badge badge-blue">{c.semester}</span>
              <span className="badge badge-gray">{c.academic_year}</span>
            </div>
          </div>
        ))}
        {!courses.length && (
          <div className="card">
            <div className="empty-state"><BookOpen size={32} /><p>No enrolled courses yet</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
