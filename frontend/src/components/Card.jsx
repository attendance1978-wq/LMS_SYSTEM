import React from 'react';

export function Card({ children, style = {} }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '14px 32px',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} LMS — Surigao del Norte. All rights reserved.
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        Surigao City &amp; San Ricardo
      </span>
    </footer>
  );
}
