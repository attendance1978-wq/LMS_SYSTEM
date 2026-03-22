import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { Plus, Pencil, Search, X, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, getStatusBadge } from '../../utils/helpers';

const BLANK = { first_name:'', last_name:'', middle_name:'', email:'', password:'', student_id_number:'', phone:'', gender:'', birth_date:'', address:'' };

export default function SchStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = (s = search) => SAd.getStudents({ search: s }).then(r => { setStudents(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, password: '' }); setModal(true); };

  const handleSearch = (e) => { e.preventDefault(); load(search); };

  const handleSave = async () => {
    try {
      if (editing) { await SAd.updateStudent(editing.id, form); toast.success('Student updated'); }
      else { await SAd.createStudent(form); toast.success('Student created'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving student'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Students</h1><p>{students.length} enrolled students</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add Student</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <input className="form-control" placeholder="Search by name, email, or ID number…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary"><Search size={15}/> Search</button>
          {search && <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); load(''); }}><X size={15}/></button>}
        </form>
      </div>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner"/>Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Student ID</th><th>Name</th><th>Email</th><th>Gender</th><th>Birthday</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><span style={{ fontFamily:'monospace', fontSize:12, background:'#f1f5f9', padding:'2px 8px', borderRadius:4 }}>{s.student_id_number || '—'}</span></td>
                    <td><strong>{s.last_name}, {s.first_name}</strong></td>
                    <td style={{ fontSize: 13, color:'var(--text-muted)' }}>{s.email}</td>
                    <td>{s.gender || '—'}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(s.birth_date)}</td>
                    <td><span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Pencil size={13}/></button></td>
                  </tr>
                ))}
                {!students.length && <tr><td colSpan={7}><div className="empty-state"><GraduationCap size={32}/><p>No students found</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header"><h2>{editing ? 'Edit Student' : 'Add New Student'}</h2><button onClick={()=>setModal(false)}><X size={18}/></button></div>
            <div className="modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['first_name','First Name'],['last_name','Last Name']].map(([k,l])=>(
                  <div key={k} className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              {[['middle_name','Middle Name'],['student_id_number','Student ID Number'],['email','Email Address'],['password',editing?'New Password (leave blank)':'Password'],['phone','Phone Number'],['address','Address']].map(([k,l])=>(
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-control" type={k==='password'?'password':'text'} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})}/>
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">Gender</label>
                  <select className="form-control" value={form.gender||''} onChange={e=>setForm({...form,gender:e.target.value})}>
                    <option value="">Select</option>
                    {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">Birth Date</label>
                  <input className="form-control" type="date" value={form.birth_date||''} onChange={e=>setForm({...form,birth_date:e.target.value})}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
