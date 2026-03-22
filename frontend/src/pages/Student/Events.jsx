import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TYPE_COLORS = {
  Academic: '#1d4ed8', Sports: '#16a34a', Cultural: '#7c3aed',
  Seminar: '#b45309', Holiday: '#dc2626', Other: '#64748b',
};

export default function STEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { ST.getEvents().then(r => { setEvents(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Events & Calendar</h1><p>{events.length} upcoming events</p></div>
      </div>

      {events.length === 0 ? (
        <div className="card"><div className="empty-state"><Calendar size={40} /><p>No upcoming events scheduled</p></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {events.map(e => {
            const color = TYPE_COLORS[e.type] || '#64748b';
            const daysLeft = Math.ceil((new Date(e.event_date) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={e.id} className="card" style={{ display: 'flex', gap: 20, padding: 20, borderLeft: `5px solid ${color}` }}>
                {/* Date box */}
                <div style={{
                  minWidth: 64, height: 64, borderRadius: 12,
                  background: `${color}15`, border: `2px solid ${color}33`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>
                    {new Date(e.event_date).getDate()}
                  </div>
                  <div style={{ fontSize: 10, color, fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>
                    {new Date(e.event_date).toLocaleString('en-PH', { month: 'short' })}
                  </div>
                </div>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <strong style={{ fontSize: 15 }}>{e.title}</strong>
                    <span style={{ background: `${color}20`, color, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                      {e.type}
                    </span>
                    {daysLeft <= 7 && daysLeft >= 0 && (
                      <span style={{ background: '#fef9c3', color: '#854d0e', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                        {daysLeft === 0 ? 'Today!' : `In ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                      </span>
                    )}
                  </div>
                  {e.description && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{e.description}</div>}
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>📅 {formatDate(e.event_date)}</span>
                    {e.start_time && <span>🕐 {e.start_time}{e.end_time ? ` – ${e.end_time}` : ''}</span>}
                    {e.venue && <span>📍 {e.venue}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
