import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MapPin, Users, School, BookOpen, ClipboardList,
  FileText, Calendar, CreditCard, GraduationCap, LogOut, ChevronRight,
  UserCheck, ClipboardCheck, BookMarked, Bell
} from 'lucide-react';

const navItems = {
  superadmin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/superadmin/dashboard' },
    { label: 'Locations', icon: MapPin, to: '/superadmin/locations' },
    { label: 'Main Admins', icon: Users, to: '/superadmin/admins' },
    { label: 'Schools', icon: School, to: '/superadmin/schools' },
    { label: 'Reports', icon: FileText, to: '/superadmin/reports' },
  ],
  mainadmin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/mainadmin/dashboard' },
    { label: 'Schools', icon: School, to: '/mainadmin/schools' },
    { label: 'School Admins', icon: Users, to: '/mainadmin/admins' },
    { label: 'Admissions', icon: UserCheck, to: '/mainadmin/admissions' },
    { label: 'Enrollment', icon: ClipboardList, to: '/mainadmin/enrollment' },
    { label: 'Academic Records', icon: BookMarked, to: '/mainadmin/records' },
    { label: 'Reports', icon: FileText, to: '/mainadmin/reports' },
  ],
  schooladmin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/schooladmin/dashboard' },
    { label: 'Students', icon: GraduationCap, to: '/schooladmin/students' },
    { label: 'Teachers', icon: Users, to: '/schooladmin/teachers' },
    { label: 'Courses', icon: BookOpen, to: '/schooladmin/courses' },
    { label: 'Attendance', icon: ClipboardCheck, to: '/schooladmin/attendance' },
    { label: 'Exams', icon: FileText, to: '/schooladmin/exams' },
    { label: 'Events', icon: Calendar, to: '/schooladmin/events' },
  ],
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
    { label: 'My Classes', icon: BookOpen, to: '/teacher/classes' },
    { label: 'Attendance', icon: ClipboardCheck, to: '/teacher/attendance' },
    { label: 'Exams & Grades', icon: FileText, to: '/teacher/exams' },
    { label: 'Messages', icon: Bell, to: '/teacher/messaging' },
  ],
  student: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
    { label: 'Profile', icon: Users, to: '/student/profile' },
    { label: 'My Courses', icon: BookOpen, to: '/student/courses' },
    { label: 'Attendance', icon: ClipboardCheck, to: '/student/attendance' },
    { label: 'Exams & Grades', icon: FileText, to: '/student/exams' },
    { label: 'Payments', icon: CreditCard, to: '/student/payments' },
    { label: 'Events', icon: Calendar, to: '/student/events' },
  ],
};

const roleColors = {
  superadmin: '#7c3aed', mainadmin: '#1e40af',
  schooladmin: '#0f766e', teacher: '#b45309', student: '#0369a1',
};

const roleLabels = {
  superadmin: 'Super Admin', mainadmin: 'Main Admin',
  schooladmin: 'School Admin', teacher: 'Teacher', student: 'Student',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  const color = roleColors[user?.role] || '#1e40af';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, width: 'var(--sidebar-w)',
      height: '100vh', background: '#0f172a', display: 'flex',
      flexDirection: 'column', zIndex: 100, borderRight: '1px solid #1e293b',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>LMS Portal</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Surigao del Norte</div>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid #1e293b' }}>
        <div style={{
          background: `${color}22`, border: `1px solid ${color}44`,
          borderRadius: 8, padding: '8px 12px',
        }}>
          <div style={{ color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Logged in as</div>
          <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, marginTop: 2 }}>
            {user?.name?.split(' ').slice(0, 2).join(' ')}
          </div>
          <div style={{
            display: 'inline-block', background: color, color: '#fff',
            borderRadius: 20, padding: '1px 8px', fontSize: 10, marginTop: 4, fontWeight: 500,
          }}>
            {roleLabels[user?.role]}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, marginBottom: 2,
            fontSize: 14, fontWeight: 500, transition: 'all .15s',
            color: isActive ? '#fff' : '#94a3b8',
            background: isActive ? color : 'transparent',
            textDecoration: 'none',
          })}>
            <Icon size={17} />
            <span style={{ flex: 1 }}>{label}</span>
            {/* active chevron */}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #1e293b' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 8, width: '100%',
          color: '#ef4444', background: 'transparent', fontSize: 14, fontWeight: 500,
          transition: 'background .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#ef444422'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
