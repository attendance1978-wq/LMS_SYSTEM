import React, { useEffect, useState } from 'react';
import { SA } from '../../utils/api';
import { School, MapPin, Phone, User } from 'lucide-react';

export default function SASchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    SA.getSchools()
      .then(r => { setSchools(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const types = ['all', ...new Set(schools.map(s => s.school_type))];
  const filtered = filter === 'all' ? schools : schools.filter(s => s.school_type === filter);

  const byLocation = filtered.reduce((acc, s) => {
    const loc = `Location #${s.location_id}`;
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(s);
    return acc;
  }, {});

  const TYPE_COLORS = {
    'Elementary': '#16a34a',
    'Junior High School': '#0369a1',
    'Senior High School': '#7c3aed',
    'College': '#b45309',
    'Vocational': '#0f766e',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All Schools</h1>
          <p>{schools.length} schools system-wide</p>
        </div>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-secondary'}`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" />Loading…</div>
      ) : (
        Object.entries(byLocation).map(([loc, locSchools]) => (
          <div key={loc} style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 14, paddingBottom: 10,
              borderBottom: '2px solid var(--border)',
            }}>
              <MapPin size={16} color="var(--primary)" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{loc}</h2>
              <span style={{
                background: '#dbeafe', color: '#1d4ed8',
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              }}>{locSchools.length} schools</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
              {locSchools.map(s => {
                const color = TYPE_COLORS[s.school_type] || '#64748b';
                return (
                  <div key={s.id} className="card" style={{ borderTop: `4px solid ${color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: `${color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <School size={20} color={color} />
                        </div>
                        <div>
                          <strong style={{ fontSize: 14, lineHeight: 1.3 }}>{s.name}</strong>
                          {s.short_name && (
                            <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 2 }}>
                              {s.short_name}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`} style={{ flexShrink: 0 }}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: `${color}18`, color, borderRadius: 6,
                        padding: '3px 10px', fontSize: 12, fontWeight: 600, width: 'fit-content',
                      }}>
                        {s.school_type}
                      </span>
                      {s.principal_name && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <User size={13} />
                          <span>{s.principal_name}</span>
                        </div>
                      )}
                      {s.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone size={13} />
                          <span>{s.phone}</span>
                        </div>
                      )}
                      {s.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={13} />
                          <span>{s.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {!loading && !filtered.length && (
        <div className="card">
          <div className="empty-state">
            <School size={40} />
            <p>No schools found for the selected filter</p>
          </div>
        </div>
      )}
    </div>
  );
}
