import React, { useEffect, useState } from 'react';
import { SAd } from '../../utils/api';
import { GraduationCap, Users, BookOpen, ClipboardList, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}22` }}><Icon size={22} color={color} /></div>
    <div className="stat-info"><h3>{value ?? '—'}</h3><p>{label}</p></div>
  </div>
);

export default function SchDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { SAd.getDashboard().then(r => setStats(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <div className="page-header"><div><h1>School Admin Dashboard</h1><p>Overview of your school</p></div></div>
      <div className="grid-stats">
        <StatCard icon={GraduationCap} label="Students" value={stats?.totalStudents} color="#0369a1" />
        <StatCard icon={Users} label="Teachers" value={stats?.totalTeachers} color="#b45309" />
        <StatCard icon={BookOpen} label="Courses" value={stats?.totalCourses} color="#0f766e" />
        <StatCard icon={ClipboardList} label="Pending Enrollments" value={stats?.pendingEnrollments} color="#dc2626" />
        <StatCard icon={Calendar} label="Upcoming Events" value={stats?.upcomingEvents} color="#7c3aed" />
      </div>
    </div>
  );
}
