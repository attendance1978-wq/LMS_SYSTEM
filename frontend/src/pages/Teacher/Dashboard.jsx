import React, { useEffect, useState } from 'react';
import { TC } from '../../utils/api';
import { BookOpen, Users, ClipboardCheck, FileText } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={22} color={color} /></div>
    <div className="stat-info"><h3>{value ?? '—'}</h3><p>{label}</p></div>
  </div>
);

export default function TCDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { TC.getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <div className="page-header">
        <div><h1>Teacher Dashboard</h1><p>Your classes and tasks at a glance</p></div>
      </div>
      <div className="grid-stats">
        <StatCard icon={BookOpen} label="My Classes" value={stats?.totalClasses} color="#b45309" />
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents} color="#0369a1" />
        <StatCard icon={ClipboardCheck} label="Today's Attendance" value={stats?.todayAttendance} color="#0f766e" />
        <StatCard icon={FileText} label="Unpublished Exams" value={stats?.pendingGrades} color="#dc2626" />
      </div>
    </div>
  );
}
