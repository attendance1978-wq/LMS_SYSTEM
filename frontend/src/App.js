import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Footer } from './components/Card';
import { loginUser } from './utils/api';
import { getRoleRoute } from './utils/helpers';
import toast from 'react-hot-toast';

// Superadmin pages
import SADashboard from './pages/Superadmin/Dashboard';
import SALocations from './pages/Superadmin/LocationManagement';
import SAAdmins from './pages/Superadmin/MainAdminManagement';
import SAReports from './pages/Superadmin/Reports';
import SASchoolsPage from './pages/Superadmin/SchoolsView';

// MainAdmin pages
import MADashboard from './pages/MainAdmin/Dashboard';
import MASchools from './pages/MainAdmin/SchoolManagement';
import MAAdmissions from './pages/MainAdmin/Admissions';
import MAEnrollment from './pages/MainAdmin/Enrollment';
import MARecords from './pages/MainAdmin/AcademicRecords';
import MAReports from './pages/MainAdmin/Reports';

// SchoolAdmin pages
import SchDashboard from './pages/SchoolAdmin/Dashboard';
import SchStudents from './pages/SchoolAdmin/Students';
import SchTeachers from './pages/SchoolAdmin/Teachers';
import SchCourses from './pages/SchoolAdmin/Courses';
import SchAttendance from './pages/SchoolAdmin/Attendance';
import SchExams from './pages/SchoolAdmin/Exams';
import SchEvents from './pages/SchoolAdmin/Events';

// Teacher pages
import TCDashboard from './pages/Teacher/Dashboard';
import TCClasses from './pages/Teacher/Classes';
import TCAttendance from './pages/Teacher/Attendance';
import TCExams from './pages/Teacher/Exams';
import TCMessaging from './pages/Teacher/Messaging';

// Student pages
import STDashboard from './pages/Student/Dashboard';
import STProfile from './pages/Student/Profile';
import STCourses from './pages/Student/Courses';
import STAttendance from './pages/Student/Attendance';
import STExams from './pages/Student/Exams';
import STPayments from './pages/Student/Payments';
import STEvents from './pages/Student/Events';

// ─── Layout wrapper ────────────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

// ─── Protected Route ────────────────────────────────────────────────────────
function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={getRoleRoute(user.role) + '/dashboard'} replace />;
  return <AppLayout>{children}</AppLayout>;
}

// ─── Login Page ────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: 'superadmin', label: 'Super Admin', api: 'superadmin', color: '#7c3aed' },
  { value: 'mainadmin', label: 'Main Admin', api: 'main-admin', color: '#1e40af' },
  { value: 'schooladmin', label: 'School Admin', api: 'school-admin', color: '#0f766e' },
  { value: 'teacher', label: 'Teacher', api: 'teacher', color: '#b45309' },
  { value: 'student', label: 'Student', api: 'student', color: '#0369a1' },
];

function LoginPage() {
  const { login, user } = useAuth();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={getRoleRoute(user.role) + '/dashboard'} replace />;

  const selected = ROLE_OPTIONS.find(r => r.value === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Email and password required');
    setLoading(true);
    try {
      const { data } = await loginUser(selected.api, { email, password });
      login(data);
      toast.success(`Welcome back, ${data.name?.split(' ')[0]}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c81 100%)',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${selected.color}, ${selected.color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: `0 8px 32px ${selected.color}44`,
            transition: 'all .3s',
          }}>
            <span style={{ fontSize: 28 }}>🎓</span>
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800 }}>LMS Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Surigao City & San Ricardo, Surigao del Norte</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(16px)',
          borderRadius: 20, border: '1px solid rgba(255,255,255,.12)',
          padding: '32px 36px',
        }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Select your role and enter credentials</p>

          {/* Role Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {ROLE_OPTIONS.map(r => (
              <button key={r.value} onClick={() => setRole(r.value)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: `2px solid ${role === r.value ? r.color : 'rgba(255,255,255,.1)'}`,
                background: role === r.value ? `${r.color}33` : 'transparent',
                color: role === r.value ? '#f1f5f9' : '#64748b',
                transition: 'all .15s',
              }}>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@school.edu.ph"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)',
                  color: '#f1f5f9', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)',
                  color: '#f1f5f9', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15,
              background: loading ? '#475569' : `linear-gradient(135deg, ${selected.color}, ${selected.color}cc)`,
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : `0 4px 20px ${selected.color}55`,
              transition: 'all .2s',
            }}>
              {loading ? 'Signing in…' : `Sign in as ${selected.label}`}
            </button>
          </form>

          <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            Default password: <span style={{ color: '#64748b', fontFamily: 'monospace' }}>password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontSize: 14 } }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* SUPERADMIN */}
          <Route path="/superadmin/dashboard" element={<ProtectedRoute roles={['superadmin']}><SADashboard /></ProtectedRoute>} />
          <Route path="/superadmin/locations" element={<ProtectedRoute roles={['superadmin']}><SALocations /></ProtectedRoute>} />
          <Route path="/superadmin/admins" element={<ProtectedRoute roles={['superadmin']}><SAAdmins /></ProtectedRoute>} />
          <Route path="/superadmin/schools" element={<ProtectedRoute roles={['superadmin']}><SASchoolsPage /></ProtectedRoute>} />
          <Route path="/superadmin/reports" element={<ProtectedRoute roles={['superadmin']}><SAReports /></ProtectedRoute>} />

          {/* MAINADMIN */}
          <Route path="/mainadmin/dashboard" element={<ProtectedRoute roles={['mainadmin']}><MADashboard /></ProtectedRoute>} />
          <Route path="/mainadmin/schools" element={<ProtectedRoute roles={['mainadmin']}><MASchools /></ProtectedRoute>} />
          <Route path="/mainadmin/admins" element={<ProtectedRoute roles={['mainadmin']}><SAAdmins /></ProtectedRoute>} />
          <Route path="/mainadmin/admissions" element={<ProtectedRoute roles={['mainadmin']}><MAAdmissions /></ProtectedRoute>} />
          <Route path="/mainadmin/enrollment" element={<ProtectedRoute roles={['mainadmin']}><MAEnrollment /></ProtectedRoute>} />
          <Route path="/mainadmin/records" element={<ProtectedRoute roles={['mainadmin']}><MARecords /></ProtectedRoute>} />
          <Route path="/mainadmin/reports" element={<ProtectedRoute roles={['mainadmin']}><MAReports /></ProtectedRoute>} />

          {/* SCHOOLADMIN */}
          <Route path="/schooladmin/dashboard" element={<ProtectedRoute roles={['schooladmin']}><SchDashboard /></ProtectedRoute>} />
          <Route path="/schooladmin/students" element={<ProtectedRoute roles={['schooladmin']}><SchStudents /></ProtectedRoute>} />
          <Route path="/schooladmin/teachers" element={<ProtectedRoute roles={['schooladmin']}><SchTeachers /></ProtectedRoute>} />
          <Route path="/schooladmin/courses" element={<ProtectedRoute roles={['schooladmin']}><SchCourses /></ProtectedRoute>} />
          <Route path="/schooladmin/attendance" element={<ProtectedRoute roles={['schooladmin']}><SchAttendance /></ProtectedRoute>} />
          <Route path="/schooladmin/exams" element={<ProtectedRoute roles={['schooladmin']}><SchExams /></ProtectedRoute>} />
          <Route path="/schooladmin/events" element={<ProtectedRoute roles={['schooladmin']}><SchEvents /></ProtectedRoute>} />

          {/* TEACHER */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute roles={['teacher']}><TCDashboard /></ProtectedRoute>} />
          <Route path="/teacher/classes" element={<ProtectedRoute roles={['teacher']}><TCClasses /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute roles={['teacher']}><TCAttendance /></ProtectedRoute>} />
          <Route path="/teacher/exams" element={<ProtectedRoute roles={['teacher']}><TCExams /></ProtectedRoute>} />
          <Route path="/teacher/messaging" element={<ProtectedRoute roles={['teacher']}><TCMessaging /></ProtectedRoute>} />

          {/* STUDENT */}
          <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><STDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><STProfile /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute roles={['student']}><STCourses /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute roles={['student']}><STAttendance /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute roles={['student']}><STExams /></ProtectedRoute>} />
          <Route path="/student/payments" element={<ProtectedRoute roles={['student']}><STPayments /></ProtectedRoute>} />
          <Route path="/student/events" element={<ProtectedRoute roles={['student']}><STEvents /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
