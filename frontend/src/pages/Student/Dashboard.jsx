import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { BookOpen, ClipboardCheck, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={22} color={color} /></div>
    <div className="stat-info">
      <h3>{value ?? '—'}</h3>
      <p>{label}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</p>}
    </div>
  </div>
);

export default function STDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => { ST.getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Student ID: <strong style={{ fontFamily: 'monospace' }}>{user?.student_id_number || 'Not assigned'}</strong></p>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={stats?.enrolledCourses} color="#0369a1" />
        <StatCard icon={ClipboardCheck} label="Attendance Rate" value={stats?.attendanceRate} color="#0f766e" sub="This semester" />
        <StatCard icon={FileText} label="Upcoming Exams" value={stats?.upcomingExams} color="#b45309" />
        <StatCard icon={CreditCard} label="Pending Payments" value={stats?.pendingPayments} color="#dc2626" sub="Requires action" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Academic Year</h3>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>2024 – 2025</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>1st Semester</div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#15803d' }}>
            ✅ Currently enrolled and active
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>School</h3>
          <div style={{ fontSize: 14, color: 'var(--text)' }}>School ID: <strong>#{user?.school_id}</strong></div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Surigao del Norte</div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#eff6ff', borderRadius: 8, fontSize: 13, color: '#1d4ed8' }}>
            📍 Region XIII – Caraga
          </div>
        </div>
      </div>
    </div>
  );
}
