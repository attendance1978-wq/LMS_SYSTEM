import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { Plus, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const BLANK = { title:'', description:'', event_date:'', start_time:'', end_time:'', venue:'', type:'Academic' };

export default function SchEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(BLANK);

  const load = () => SAd.getEvents().then(r => { setEvents(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try { await SAd.createEvent(form); toast.success('Event created'); setModal(false); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Events & Calendar</h1><p>{events.length} events scheduled</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(BLANK); setModal(true); }}><Plus size={16}/> Add Event</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {events.map(e => (
          <div key={e.id} className="card" style={{ borderLeft:`4px solid var(--primary)` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <Calendar size={16} color="var(--primary)"/>
              <strong style={{ fontSize:15 }}>{e.title}</strong>
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>{formatDate(e.event_date)} {e.start_time && `• ${e.start_time}`}</div>
            {e.venue && <div style={{ fontSize:13, color:'var(--text-muted)' }}>📍 {e.venue}</div>}
            <span className="badge badge-blue" style={{ marginTop:10 }}>{e.type}</span>
          </div>
        ))}
        {!events.length && !loading && <div className="card"><div className="empty-state"><Calendar size={32}/><p>No events scheduled</p></div></div>}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>Add Event</h2><button onClick={()=>setModal(false)}><X size={18}/></button></div>
            <div className="modal-body">
              {[['title','Event Title'],['venue','Venue']].map(([k,l])=>(
                <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-control" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>
              ))}
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                {[['event_date','Date','date'],['start_time','Start','time'],['end_time','End','time']].map(([k,l,t])=>(
                  <div key={k} className="form-group" style={{marginBottom:0}}><label className="form-label">{l}</label><input className="form-control" type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></div>
                ))}
              </div>
              <div className="form-group" style={{marginTop:14}}><label className="form-label">Event Type</label>
                <select className="form-control" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  {['Academic','Sports','Cultural','Seminar','Holiday','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
