import React from 'react';
import { Bell } from 'lucide-react';

export default function TCMessaging() {
  return (
    <div>
      <div className="page-header">
        <div><h1>Messages</h1><p>Announcements and notifications</p></div>
      </div>
      <div className="card">
        <div className="empty-state">
          <Bell size={40} />
          <p style={{ marginTop: 12, fontSize: 15 }}>No messages yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Messaging feature coming soon.</p>
        </div>
      </div>
    </div>
  );
}
