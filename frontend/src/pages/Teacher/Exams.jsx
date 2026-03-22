import React, { useEffect, useState } from 'react';
import { TC } from '../../utils/api';
import { Plus, X, FileText, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const BLANK = { course_id: '', title: '', type: 'Quiz', exam_date: '', total_score: 100, passing_score: 75, description: '' };
const EXAM_TYPES = ['Quiz', 'Midterm', 'Finals', 'Activity', 'Assignment', 'Project'];

export default function TCExams() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(BLANK);

  const loadExams = () => TC.getExams().then(r => { setExams(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => {
    loadExams();
    TC.getClasses().then(r => setClasses(r.data)).catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!form.course_id || !form.title || !form.exam_date) return toast.error('Fill in required fields');
    try {
      await TC.createExam({ ...form, course_id: parseInt(form.course_id) });
      toast.success('Exam created');
      setModal(false);
      loadExams();
    } catch (e) { toast.error(e.response?.data?.message || 'Error creating exam'); }
  };

  const grouped = EXAM_TYPES.reduce((acc, t) => {
    acc[t] = exams.filter(e => e.type === t);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <div><h1>Exams & Grades</h1><p>{exams.length} total exams across your courses</p></div>
        <button className="btn btn-primary" onClick={() => { setForm(BLANK); setModal(true); }}>
          <Plus size={16} /> Create Exam
        </button>
      </div>

      {loading ? <div className="loading"><div className="spinner" />Loading…</div> : (
        <>
          {/* Summary cards */}
          <div className="grid-stats" style={{ marginBottom: 24 }}>
            {EXAM_TYPES.map(t => (
              <div key={t} className="stat-card">
                <div className="stat-icon" style={{ background: '#dbeafe' }}>
                  <FileText size={20} color="#1d4ed8" />
                </div>
                <div className="stat-info">
                  <h3>{grouped[t].length}</h3>
                  <p>{t}s</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Exam Title</th>
                    <th>Type</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Passing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map(e => (
                    <tr key={e.id}>
                      <td><strong>{e.title}</strong></td>
                      <td><span className="badge badge-blue">{e.type}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>Course #{e.course_id}</td>
                      <td style={{ fontSize: 13 }}>{formatDate(e.exam_date)}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{e.total_score}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{e.passing_score}</td>
                      <td>
                        <span className={`badge ${e.is_published ? 'badge-green' : 'badge-yellow'}`}>
                          {e.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!exams.length && (
                    <tr><td colSpan={7}>
                      <div className="empty-state"><ClipboardList size={32} /><p>No exams created yet</p></div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Exam</h2>
              <button onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Course *</label>
                <select className="form-control" value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
                  <option value="">— Select Course —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Exam Title *</label>
                <input className="form-control" placeholder="e.g. Midterm Exam Chapter 1-5" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Exam Date *</label>
                  <input className="form-control" type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Total Score</label>
                  <input className="form-control" type="number" value={form.total_score} onChange={e => setForm({ ...form, total_score: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Passing Score</label>
                  <input className="form-control" type="number" value={form.passing_score} onChange={e => setForm({ ...form, passing_score: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">Description (optional)</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
