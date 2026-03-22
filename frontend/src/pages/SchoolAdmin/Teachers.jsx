import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { Plus, Pencil, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const BLANK = { first_name:'', last_name:'', email:'', password:'', phone:'', gender:'' };

export default function SchTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(BLANK);

  const load = () => SAd.getTeachers().then(r => { setTeachers(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try { await SAd.createTeacher(form); toast.success('Teacher added'); setModal(false); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Teachers</h1><p>{teachers.length} active teachers</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(BLANK); setModal(true); }}><Plus size={16}/> Add Teacher</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Gender</th><th>Status</th></tr></thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.first_name} {t.last_name}</strong></td>
                    <td style={{ fontSize:13, color:'var(--text-muted)' }}>{t.email}</td>
                    <td>{t.phone || '—'}</td>
                    <td>{t.gender || '—'}</td>
                    <td><span className={`badge ${t.is_active ? 'badge-green' : 'badge-red'}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))}
                {!teachers.length && <tr><td colSpan={5}><div className="empty-state"><Users size={32}/><p>No teachers yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>Add Teacher</h2><button onClick={()=>setModal(false)}><X size={18}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['first_name','First Name'],['last_name','Last Name']].map(([k,l])=>(
                  <div key={k} className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              {[['email','Email'],['password','Password'],['phone','Phone']].map(([k,l])=>(
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-control" type={k==='password'?'password':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select</option>
                  {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                </select>
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
