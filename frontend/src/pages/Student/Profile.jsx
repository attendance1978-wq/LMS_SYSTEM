import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

export default function STProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => ST.getProfile().then(r => { setProfile(r.data); setForm(r.data); }).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ST.updateProfile(form);
      toast.success('Profile updated');
      setEditing(false);
      load();
    } catch { toast.error('Error updating profile'); }
    setSaving(false);
  };

  if (!profile) return <div className="loading"><div className="spinner" />Loading…</div>;

  const fields = [
    ['first_name', 'First Name'], ['last_name', 'Last Name'],
    ['middle_name', 'Middle Name'], ['phone', 'Phone'],
    ['address', 'Address'],
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>My Profile</h1><p>Personal information and account details</p></div>
        {!editing
          ? <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
          : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}><Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          )
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Avatar card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 34, color: '#fff', fontWeight: 800,
          }}>
            {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{profile.first_name} {profile.last_name}</h3>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 12px' }}>{profile.email}</div>
          <span className="badge badge-blue" style={{ fontSize: 12 }}>Student</span>
          <div style={{ marginTop: 16, padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: 13 }}>
            <div style={{ color: 'var(--text-muted)' }}>Student ID</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, marginTop: 2 }}>{profile.student_id_number || 'Not assigned'}</div>
          </div>
          <div style={{ marginTop: 10, padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: 13 }}>
            <div style={{ color: 'var(--text-muted)' }}>Joined</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{formatDate(profile.created_at)}</div>
          </div>
        </div>

        {/* Info card */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {fields.map(([k, l]) => (
              <div key={k} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{l}</label>
                {editing
                  ? <input className="form-control" value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                  : <div style={{ padding: '10px 0', fontSize: 14, borderBottom: '1px solid var(--border)', color: profile[k] || 'var(--text-muted)' }}>{profile[k] || '—'}</div>
                }
              </div>
            ))}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              {editing
                ? <select className="form-control" value={form.gender || ''} onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select</option>
                    {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                  </select>
                : <div style={{ padding: '10px 0', fontSize: 14, borderBottom: '1px solid var(--border)' }}>{profile.gender || '—'}</div>
              }
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Birth Date</label>
              {editing
                ? <input className="form-control" type="date" value={form.birth_date || ''} onChange={e => setForm({ ...form, birth_date: e.target.value })} />
                : <div style={{ padding: '10px 0', fontSize: 14, borderBottom: '1px solid var(--border)' }}>{formatDate(profile.birth_date)}</div>
              }
            </div>
          </div>
          {editing && (
            <div className="form-group" style={{ marginTop: 18 }}>
              <label className="form-label">New Password (leave blank to keep)</label>
              <input className="form-control" type="password" placeholder="••••••••" onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
