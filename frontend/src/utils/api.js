import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lms_user');
      localStorage.removeItem('lms_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginUser = (role, data) => api.post(`/${role}/login`, data);

// Superadmin
export const SA = {
  getDashboard: () => api.get('/superadmin/dashboard'),
  getLocations: () => api.get('/superadmin/locations'),
  createLocation: (d) => api.post('/superadmin/locations', d),
  updateLocation: (id, d) => api.put(`/superadmin/locations/${id}`, d),
  deleteLocation: (id) => api.delete(`/superadmin/locations/${id}`),
  getAdmins: () => api.get('/superadmin/admins'),
  createAdmin: (d) => api.post('/superadmin/admins', d),
  updateAdmin: (id, d) => api.put(`/superadmin/admins/${id}`, d),
  toggleAdmin: (id) => api.patch(`/superadmin/admins/${id}/toggle`),
  getSchools: () => api.get('/superadmin/schools'),
  getReports: () => api.get('/superadmin/reports'),
};

// Main Admin
export const MA = {
  getDashboard: () => api.get('/main-admin/dashboard'),
  getSchools: () => api.get('/main-admin/schools'),
  createSchool: (d) => api.post('/main-admin/schools', d),
  updateSchool: (id, d) => api.put(`/main-admin/schools/${id}`, d),
  getSchoolAdmins: () => api.get('/main-admin/school-admins'),
  createSchoolAdmin: (d) => api.post('/main-admin/school-admins', d),
  getEnrollments: (p) => api.get('/main-admin/enrollments', { params: p }),
  approveEnrollment: (id) => api.patch(`/main-admin/enrollments/${id}/approve`),
  getAcademicRecords: (p) => api.get('/main-admin/academic-records', { params: p }),
  getReports: () => api.get('/main-admin/reports'),
};

// School Admin
export const SAd = {
  getDashboard: () => api.get('/school-admin/dashboard'),
  getStudents: (p) => api.get('/school-admin/students', { params: p }),
  createStudent: (d) => api.post('/school-admin/students', d),
  updateStudent: (id, d) => api.put(`/school-admin/students/${id}`, d),
  getTeachers: () => api.get('/school-admin/teachers'),
  createTeacher: (d) => api.post('/school-admin/teachers', d),
  getCourses: () => api.get('/school-admin/courses'),
  createCourse: (d) => api.post('/school-admin/courses', d),
  updateCourse: (id, d) => api.put(`/school-admin/courses/${id}`, d),
  getAttendance: (p) => api.get('/school-admin/attendance', { params: p }),
  getExams: () => api.get('/school-admin/exams'),
  getEvents: () => api.get('/school-admin/events'),
  createEvent: (d) => api.post('/school-admin/events', d),
};

// Teacher
export const TC = {
  getDashboard: () => api.get('/teacher/dashboard'),
  getProfile: () => api.get('/teacher/profile'),
  updateProfile: (d) => api.put('/teacher/profile', d),
  getClasses: () => api.get('/teacher/classes'),
  getCourseStudents: (id) => api.get(`/teacher/classes/${id}/students`),
  markAttendance: (d) => api.post('/teacher/attendance', d),
  getCourseAttendance: (id, p) => api.get(`/teacher/attendance/${id}`, { params: p }),
  getExams: () => api.get('/teacher/exams'),
  createExam: (d) => api.post('/teacher/exams', d),
  submitGrades: (id, d) => api.post(`/teacher/exams/${id}/grades`, d),
};

// Student
export const ST = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (d) => api.put('/student/profile', d),
  getCourses: () => api.get('/student/courses'),
  enrollCourse: (d) => api.post('/student/courses/enroll', d),
  getAttendance: (p) => api.get('/student/attendance', { params: p }),
  getExams: () => api.get('/student/exams'),
  getPayments: () => api.get('/student/payments'),
  getEvents: () => api.get('/student/events'),
};

export default api;
