import React, { useEffect, useState } from 'react';
import { MA } from '../../utils/api';
import { School, Users, GraduationCap, ClipboardList, BookOpen } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={22} color={color} /></div>
    <div className="stat-info"><h3>{value ?? '—'}</h3><p>{label}</p></div>
  </div>
);

export default function MADashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { MA.getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <div className="page-header"><div><h1>Main Admin Dashboard</h1><p>Schools under your jurisdiction</p></div></div>
      <div className="grid-stats">
        <StatCard icon={School} label="Schools" value={stats?.totalSchools} color="#1e40af" />
        <StatCard icon={Users} label="School Admins" value={stats?.totalSchoolAdmins} color="#0f766e" />
        <StatCard icon={Users} label="Teachers" value={stats?.totalTeachers} color="#b45309" />
        <StatCard icon={GraduationCap} label="Students" value={stats?.totalStudents} color="#0369a1" />
        <StatCard icon={ClipboardList} label="Pending Enrollments" value={stats?.pendingEnrollments} color="#dc2626" />
      </div>
    </div>
  );
}
