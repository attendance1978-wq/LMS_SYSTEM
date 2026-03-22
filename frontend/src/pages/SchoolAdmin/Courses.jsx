import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { Plus, Pencil, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const BLANK = { name:'', code:'', description:'', teacher_id:'', units:3, schedule:'', room:'', semester:'1st Semester', academic_year:'2024-2025', max_students:40 };

export default function SchCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = () => SAd.getCourses().then(r => { setCourses(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editing) { await SAd.updateCourse(editing.id, form); toast.success('Course updated'); }
      else { await SAd.createCourse(form); toast.success('Course created'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Courses</h1><p>{courses.length} active courses</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(BLANK); setModal(true); }}><Plus size={16}/> Add Course</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Code</th><th>Course Name</th><th>Teacher</th><th>Schedule</th><th>Room</th><th>Units</th><th>Actions</th></tr></thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td><span style={{ fontFamily:'monospace', fontSize:12, background:'#dbeafe', color:'#1d4ed8', padding:'2px 8px', borderRadius:4 }}>{c.code}</span></td>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.teacher_id ? `Teacher #${c.teacher_id}` : <span style={{color:'var(--text-muted)'}}>Unassigned</span>}</td>
                    <td style={{ fontSize:13 }}>{c.schedule || '—'}</td>
                    <td>{c.room || '—'}</td>
                    <td style={{ textAlign:'center' }}>{c.units}</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => { setEditing(c); setForm(c); setModal(true); }}><Pencil size={13}/></button></td>
                  </tr>
                ))}
                {!courses.length && <tr><td colSpan={7}><div className="empty-state"><BookOpen size={32}/><p>No courses yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>{editing?'Edit Course':'Add Course'}</h2><button onClick={()=>setModal(false)}><X size={18}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['name','Course Name'],['code','Course Code']].map(([k,l])=>(
                  <div key={k} className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              {[['description','Description'],['schedule','Schedule'],['room','Room']].map(([k,l])=>(
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-control" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                {[['units','Units','number'],['max_students','Max Students','number'],['teacher_id','Teacher ID','number']].map(([k,l,t])=>(
                  <div key={k} className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" type={t} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
