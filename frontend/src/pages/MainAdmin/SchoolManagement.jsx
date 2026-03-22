import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';
import { Plus, Pencil, X, School } from 'lucide-react';
import toast from 'react-hot-toast';

const BLANK = { name:'', short_name:'', location_id:'', address:'', phone:'', email:'', principal_name:'', school_type:'Senior High School' };
const TYPES = ['Elementary','Junior High School','Senior High School','College','Vocational'];

export default function SchoolManagement() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = () => MA.getSchools().then(r => { setSchools(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm(s); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) { await MA.updateSchool(editing.id, form); toast.success('School updated'); }
      else { await MA.createSchool(form); toast.success('School created'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>School Management</h1><p>{schools.length} schools under your management</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add School</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>School</th><th>Type</th><th>Principal</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {schools.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong><br/><span style={{color:'var(--text-muted)',fontSize:12}}>{s.short_name}</span></td>
                    <td><span className="badge badge-blue">{s.school_type}</span></td>
                    <td>{s.principal_name || '—'}</td>
                    <td>{s.phone || '—'}</td>
                    <td><span className={`badge ${s.is_active?'badge-green':'badge-red'}`}>{s.is_active?'Active':'Inactive'}</span></td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Pencil size={13}/></button></td>
                  </tr>
                ))}
                {!schools.length && <tr><td colSpan={6}><div className="empty-state"><School size={32}/><p>No schools yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>{editing?'Edit School':'Add School'}</h2><button onClick={()=>setModal(false)}><X size={18}/></button></div>
            <div className="modal-body">
              {[['name','School Name'],['short_name','Short Name'],['address','Address'],['phone','Phone'],['email','Email'],['principal_name','Principal Name']].map(([k,l])=>(
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-control" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">School Type</label>
                <select className="form-control" value={form.school_type} onChange={e=>setForm({...form,school_type:e.target.value})}>
                  {TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location ID</label>
                <input className="form-control" type="number" value={form.location_id||''} onChange={e=>setForm({...form,location_id:e.target.value})}/>
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
