import React from 'react';
import { ClipboardList, ShieldAlert, Award, Clock, AlertTriangle, Printer } from 'lucide-react';
import { AGO_2026_TOURNAMENT } from '../data/ago2026Rules';

export default function RefereeCheatSheet({ selectedDivision }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-panel gold-border" style={{ padding: '1.75rem' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-muted)' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
              Ringside Quick Reference
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: '800', margin: 0 }}>
              AGO 2026 Referee & Ring Marshal Cheat Sheet
            </h2>
          </div>
          <button onClick={handlePrint} className="btn btn-gold" style={{ fontSize: '0.85rem' }}>
            <Printer size={16} /> Print / Save PDF Cheat Sheet
          </button>
        </div>

        {/* 4-Box Summary Matrix */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          
          {/* Box 1: Point Scoring Matrix */}
          <div style={{ background: '#11192a', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={18} /> Target Scoring Matrix (AGO-3.0)
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: '#d1d5db' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-muted)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#fff' }}>Deep Target (3 Pts)</td>
                  <td style={{ padding: '0.5rem 0' }}>Head, Mask, Chest, Ribs, Upper Back</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-muted)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#93c5fd' }}>Shallow Target (2 Pts)</td>
                  <td style={{ padding: '0.5rem 0' }}>Bicep, Forearm, Thigh, Knee, Calf</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-muted)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#6ee7b7' }}>Extremity Target (1 Pt)</td>
                  <td style={{ padding: '0.5rem 0' }}>Hands, Gloves, Gorget, Feet</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-muted)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#fcd34d' }}>Takedown / Disarm (+2 Pts)</td>
                  <td style={{ padding: '0.5rem 0' }}>Controlled throw or weapon strip</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#fca5a5' }}>Forbidden Target (0 Pts)</td>
                  <td style={{ padding: '0.5rem 0' }}>Spine, Groin, Face Pommel Strike</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Box 2: Key Match Constraints */}
          <div style={{ background: '#11192a', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={18} /> Match Limits & Clocks
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.4rem' }}>
                <strong>Match Duration:</strong> <span>3 Minutes Running Time (First to 10 pts)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.4rem' }}>
                <strong>Grapple Limit:</strong> <span>3 Seconds Max (Referee count: "1, 2, HALT")</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '0.4rem' }}>
                <strong>Afterblow Window:</strong> <span>1 Tempo / 1 Step maximum</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Double Hit Limit:</strong> <span>Max 3 Doubles. 4th Double = Double Loss</span>
              </li>
            </ul>
          </div>

          {/* Box 3: Official Referee Commands */}
          <div style={{ background: '#11192a', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={18} color="var(--accent-gold)" /> Ring Commands Protocol
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--text-gold)' }}>"FIGHT!" / "FENCE!"</strong> - Begin or resume action.
              </div>
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                <strong style={{ color: 'var(--accent-crimson)' }}>"HALT!"</strong> - Stop all action immediately.
              </div>
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                <strong style={{ color: '#93c5fd' }}>"QUALITY?" / "AFTERBLOW?"</strong> - Poll side judge votes.
              </div>
              <div style={{ background: '#0a0f1d', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
                <strong style={{ color: '#6ee7b7' }}>"POINT RED 3 - AFTERBLOW BLUE 2 = 1 POINT RED"</strong> - Official call announcement.
              </div>
            </div>
          </div>

          {/* Box 4: Card Penalty Progression */}
          <div style={{ background: '#11192a', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} /> Penalty Card Escalation (AGO-8.0)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-gold">Verbal Warning</span>
                <span style={{ color: 'var(--text-muted)' }}>Minor delay, informal boundary step.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-gold" style={{ background: 'rgba(245,158,11,0.3)', color: '#fde047' }}>Yellow Card (-1 Pt)</span>
                <span style={{ color: 'var(--text-muted)' }}>Strike after HALT, face pommel, spine hit.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-crimson">Red Card (-3 Pts / Forfeit)</span>
                <span style={{ color: 'var(--text-muted)' }}>Dangerous throw, unsportsmanlike conduct.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-crimson" style={{ background: '#000', border: '1px solid #ef4444' }}>Black Card (DQ)</span>
                <span style={{ color: 'var(--text-muted)' }}>Ejection from entire AGO 2026 event.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
