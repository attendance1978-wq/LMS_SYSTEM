export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return `₱${parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
};

export const getStatusBadge = (status) => {
  const map = {
    Active: 'badge-green', Enrolled: 'badge-green', Paid: 'badge-green', Present: 'badge-green', Passed: 'badge-green',
    Inactive: 'badge-red', Dropped: 'badge-red', Cancelled: 'badge-red', Absent: 'badge-red', Failed: 'badge-red',
    Pending: 'badge-yellow', Partial: 'badge-yellow', Late: 'badge-yellow', Overdue: 'badge-red',
    Completed: 'badge-blue', Excused: 'badge-blue',
  };
  return map[status] || 'badge-gray';
};

export const getRoleLabel = (role) => {
  const map = {
    superadmin: 'Super Admin', mainadmin: 'Main Admin',
    schooladmin: 'School Admin', teacher: 'Teacher', student: 'Student',
  };
  return map[role] || role;
};

export const getRoleRoute = (role) => {
  const map = {
    superadmin: '/superadmin', mainadmin: '/mainadmin',
    schooladmin: '/schooladmin', teacher: '/teacher', student: '/student',
  };
  return map[role] || '/login';
};

export const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;
