import React, { useEffect, useState } from 'react';
import { SA } from '../../utils/api';
import { Plus, Pencil, Trash2, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

export default function LocationManagement() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', province: 'Surigao del Norte', region: 'Region XIII (Caraga)' });

  const load = () => SA.getLocations().then(r => { setLocations(r.data); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', province: 'Surigao del Norte', region: 'Region XIII (Caraga)' }); setModal(true); };
  const openEdit = (loc) => { setEditing(loc); setForm({ name: loc.name, province: loc.province, region: loc.region }); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) { await SA.updateLocation(editing.id, form); toast.success('Location updated'); }
      else { await SA.createLocation(form); toast.success('Location created'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this location?')) return;
    try { await SA.deleteLocation(id); toast.success('Location deactivated'); load(); }
    catch (e) { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Location Management</h1><p>Manage Surigao City & San Ricardo</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Location</button>
      </div>

      <div className="card">
        {loading ? <div className="loading"><div className="spinner" />Loading…</div> : (
          <div className="table-container">
            <table>
              <thead><tr><th>#</th><th>Location Name</th><th>Province</th><th>Region</th><th>Status</th><th>Added</th><th>Actions</th></tr></thead>
              <tbody>
                {locations.map(loc => (
                  <tr key={loc.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{loc.id}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={15} color="var(--primary)" /><strong>{loc.name}</strong></div></td>
                    <td>{loc.province}</td>
                    <td>{loc.region}</td>
                    <td><span className={`badge ${loc.is_active ? 'badge-green' : 'badge-red'}`}>{loc.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(loc.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(loc)}><Pencil size={13} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(loc.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!locations.length && <tr><td colSpan={7}><div className="empty-state"><MapPin size={32} /><p>No locations yet</p></div></td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Location' : 'Add Location'}</h2>
              <button onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {['name', 'province', 'region'].map(f => (
                <div key={f} className="form-group">
                  <label className="form-label">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                  <input className="form-control" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} />
                </div>
              ))}
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
