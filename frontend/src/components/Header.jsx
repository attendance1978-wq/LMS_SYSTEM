import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard', locations: 'Location Management',
  admins: 'Admin Management', schools: 'School Management',
  reports: 'Reports', students: 'Student Management',
  teachers: 'Teacher Management', courses: 'Course Management',
  attendance: 'Attendance', exams: 'Exams & Grades',
  events: 'Events & Calendar', payments: 'Payments',
  profile: 'My Profile', classes: 'My Classes',
  messaging: 'Messages', enrollment: 'Enrollment',
  admissions: 'Admissions', records: 'Academic Records',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const segment = location.pathname.split('/').pop();
  const title = pageTitles[segment] || 'LMS Portal';
  const now = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--sidebar-w)',
      right: 0, height: 'var(--header-h)',
      background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', zIndex: 90,
    }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{now}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{
          width: 36, height: 36, borderRadius: 8,
          background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', border: '1px solid var(--border)',
        }}>
          <Bell size={16} />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '6px 12px', background: '#f8fafc',
          borderRadius: 8, border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
              {user?.name?.split(' ').slice(0, 2).join(' ')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
