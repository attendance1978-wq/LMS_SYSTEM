import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';
import { RefreshCw } from 'lucide-react';

export default function MAReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); MA.getReports().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;
  return (
    <div>
      <div className="page-header">
        <div><h1>Reports</h1><p>Generated: {new Date(data?.generated_at).toLocaleString('en-PH')}</p></div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>
      <div className="grid-stats">
        {[['Schools', data?.schools], ['Enrollments', data?.enrollments], ['Students', data?.students], ['Teachers', data?.teachers]].map(([l, v]) => (
          <div key={l} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>{v}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
