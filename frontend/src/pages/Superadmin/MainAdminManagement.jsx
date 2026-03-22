import React, { useEffect, useState } from 'react';
import { SA } from '../../utils/api';
import { Plus, Pencil, ToggleLeft, ToggleRight, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const BLANK = { first_name: '', last_name: '', email: '', password: '', phone: '', location_id: '' };

export default function MainAdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = () => SA.getAdmins().then(r => { setAdmins(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (a) => { setEditing(a); setForm({ ...a, password: '' }); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) { await SA.updateAdmin(editing.id, form); toast.success('Admin updated'); }
      else { await SA.createAdmin(form); toast.success('Admin created'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleToggle = async (id) => {
    try { await SA.toggleAdmin(id); toast.success('Status toggled'); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Main Admin Management</h1><p>Manage main admins per location</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Admin</button>
      </div>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" />Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.first_name} {a.last_name}</strong></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.email}</td>
                    <td>{a.phone || '—'}</td>
                    <td>{a.location_id ? `Location #${a.location_id}` : '—'}</td>
                    <td><span className={`badge ${a.is_active ? 'badge-green' : 'badge-red'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(a.last_login) || 'Never'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}><Pencil size={13} /></button>
                        <button className={`btn btn-sm ${a.is_active ? 'btn-danger' : 'btn-success'}`} onClick={() => handleToggle(a.id)}>
                          {a.is_active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!admins.length && <tr><td colSpan={7}><div className="empty-state"><Users size={32} /><p>No admins yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Admin' : 'Add Main Admin'}</h2>
              <button onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['first_name', 'First Name'], ['last_name', 'Last Name']].map(([k, l]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{l}</label>
                    <input className="form-control" value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              {[['email', 'Email', 'email'], ['password', editing ? 'New Password (leave blank to keep)' : 'Password', 'password'], ['phone', 'Phone', 'tel']].map(([k, l, t]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-control" type={t} value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Location ID</label>
                <input className="form-control" type="number" value={form.location_id || ''} onChange={e => setForm({ ...form, location_id: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
