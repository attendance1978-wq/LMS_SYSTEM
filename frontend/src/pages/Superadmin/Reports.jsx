import React, { useEffect, useState } from 'react';
import { SA } from '../../utils/api';
import { FileText, RefreshCw } from 'lucide-react';

export default function SAReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); SA.getReports().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>System Reports</h1><p>Generated: {new Date(data?.generated_at).toLocaleString('en-PH')}</p></div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>User Summary</h3>
          {Object.entries(data?.users || {}).map(([role, count]) => (
            <div key={role} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ textTransform: 'capitalize', fontSize: 14 }}>{role}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Active Locations</h3>
          {(data?.locations || []).map(loc => (
            <div key={loc.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <strong>{loc.name}</strong>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{loc.province} — {loc.region}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px', background: '#f0fdf4', borderRadius: 8 }}>
            <strong>Total Schools: </strong>{data?.schools_count}
          </div>
        </div>
      </div>
    </div>
  );
}
