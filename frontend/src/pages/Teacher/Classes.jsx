import React, { useEffect, useState } from 'react';
import { TC } from '../../utils/api';
import { BookOpen } from 'lucide-react';

export default function TCClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { TC.getClasses().then(r => { setClasses(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>My Classes</h1><p>{classes.length} assigned courses this semester</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {classes.map(c => (
          <div key={c.id} className="card" style={{ borderTop: '4px solid #b45309' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="#b45309" />
              </div>
              <div>
                <strong style={{ fontSize: 15 }}>{c.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.code}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'grid', gap: 5 }}>
              {c.schedule && <div>🕐 {c.schedule}</div>}
              {c.room && <div>📍 Room {c.room}</div>}
              <div>📚 {c.units} units · Max {c.max_students} students</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span className="badge badge-yellow">{c.semester}</span>
                <span className="badge badge-gray">{c.academic_year}</span>
              </div>
            </div>
          </div>
        ))}
        {!classes.length && (
          <div className="card">
            <div className="empty-state"><BookOpen size={32} /><p>No classes assigned yet</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
