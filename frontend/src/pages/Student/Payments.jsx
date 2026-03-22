import React, { useEffect, useState } from 'react';
import { ST } from '../../utils/api';
import { formatDate, formatCurrency, getStatusBadge } from '../../utils/helpers';
import { CreditCard } from 'lucide-react';

export default function STPayments() {
  const [data, setData] = useState({ summary: {}, payments: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => { ST.getPayments().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading…</div>;

  const { summary, payments } = data;

  return (
    <div>
      <div className="page-header"><div><h1>Payments</h1><p>Fee payments and balance summary</p></div></div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', border: 'none' }}>
          <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>Total Paid</div>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginTop: 6 }}>{formatCurrency(summary.totalPaid)}</div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none' }}>
          <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>Outstanding Balance</div>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginTop: 6 }}>{formatCurrency(summary.totalDue)}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Payment History</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Reference No.</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Semester</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                      {p.reference_no}
                    </span>
                  </td>
                  <td>{p.payment_type}</td>
                  <td style={{ fontWeight: 700, fontSize: 15 }}>{formatCurrency(p.amount)}</td>
                  <td style={{ fontSize: 13 }}>{p.payment_method}</td>
                  <td style={{ fontSize: 13 }}>{formatDate(p.payment_date)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.semester} {p.academic_year}</td>
                  <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span></td>
                </tr>
              ))}
              {!payments.length && (
                <tr><td colSpan={7}>
                  <div className="empty-state"><CreditCard size={32} /><p>No payment records found</p></div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
