import React, { useEffect, useState } from 'react';
import { TC } from '../../utils/api';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Present: { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
  Absent:  { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c' },
  Late:    { bg: '#fef9c3', border: '#ca8a04', text: '#854d0e' },
  Excused: { bg: '#dbeafe', border: '#2563eb', text: '#1d4ed8' },
};

export default function TCAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { TC.getClasses().then(r => setClasses(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    TC.getCourseStudents(selectedCourse).then(r => {
      setStudents(r.data);
      const init = {};
      r.data.forEach(s => { init[s.id] = 'Present'; });
      setRecords(init);
    }).catch(() => {});
  }, [selectedCourse]);

  const setAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setRecords(updated);
  };

  const handleSave = async () => {
    if (!selectedCourse || !date) return toast.error('Select a course and date');
    if (!students.length) return toast.error('No students in this course');
    setSaving(true);
    try {
      const recs = Object.entries(records).map(([student_id, status]) => ({
        student_id: parseInt(student_id), status,
      }));
      await TC.markAttendance({ course_id: parseInt(selectedCourse), date, records: recs });
      toast.success(`Attendance saved for ${recs.length} students`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error saving attendance');
    }
    setSaving(false);
  };

  const presentCount = Object.values(records).filter(s => s === 'Present').length;
  const absentCount = Object.values(records).filter(s => s === 'Absent').length;

  return (
    <div>
      <div className="page-header">
        <div><h1>Mark Attendance</h1><p>Record student attendance per session</p></div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Course</label>
            <select className="form-control" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              <option value="">— Choose a course —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="card">
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{students.length} Students</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>{presentCount} Present</span>
                {' · '}
                <span style={{ color: '#dc2626', fontWeight: 600 }}>{absentCount} Absent</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setAll('Present')}>All Present</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setAll('Absent')}>All Absent</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Attendance'}
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Student Name</th>
                  <th>ID Number</th>
                  {['Present', 'Absent', 'Late', 'Excused'].map(s => (
                    <th key={s} style={{ textAlign: 'center', width: 90 }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const current = records[s.id] || 'Present';
                  return (
                    <tr key={s.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                      <td>
                        <strong>{s.last_name}, {s.first_name}</strong>
                        {s.middle_name && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}> {s.middle_name.charAt(0)}.</span>}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                          {s.student_id_number || '—'}
                        </span>
                      </td>
                      {['Present', 'Absent', 'Late', 'Excused'].map(status => {
                        const isSelected = current === status;
                        const colors = STATUS_COLORS[status];
                        return (
                          <td key={status} style={{ textAlign: 'center' }}>
                            <button onClick={() => setRecords({ ...records, [s.id]: status })} style={{
                              width: 36, height: 36, borderRadius: 8,
                              border: `2px solid ${isSelected ? colors.border : 'var(--border)'}`,
                              background: isSelected ? colors.bg : 'transparent',
                              color: isSelected ? colors.text : 'var(--text-muted)',
                              cursor: 'pointer', fontWeight: 700, fontSize: 11,
                              transition: 'all .12s',
                            }}>
                              {status.charAt(0)}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCourse && !students.length && (
        <div className="card">
          <div className="empty-state"><p>No students enrolled in this course</p></div>
        </div>
      )}
    </div>
  );
}
