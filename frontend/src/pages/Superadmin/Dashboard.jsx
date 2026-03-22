import React, { useEffect, useState } from 'react';
import { SA } from '../../utils/api';
import { MapPin, Users, School, GraduationCap, ChalkboardTeacher } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}22` }}>
      <Icon size={22} color={color} />
    </div>
    <div className="stat-info">
      <h3>{value ?? '—'}</h3>
      <p>{label}</p>
    </div>
  </div>
);

export default function SADashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    SA.getDashboard().then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>System-wide overview — Surigao del Norte</p>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard icon={MapPin}  label="Locations"  value={stats?.totalLocations}  color="#7c3aed" />
        <StatCard icon={School}  label="Schools"    value={stats?.totalSchools}    color="#1e40af" />
        <StatCard icon={Users}   label="Main Admins" value={stats?.totalAdmins}    color="#0f766e" />
        <StatCard icon={GraduationCap} label="Students" value={stats?.totalStudents} color="#0369a1" />
        <StatCard icon={Users}   label="Teachers"   value={stats?.totalTeachers}   color="#b45309" />
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>System Info</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Managing schools across <strong>Surigao City</strong> and <strong>San Ricardo</strong>, Surigao del Norte (Region XIII - Caraga).
        </p>
      </div>
    </div>
  );
}
