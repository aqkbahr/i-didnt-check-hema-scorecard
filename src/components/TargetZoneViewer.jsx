import React, { useState } from 'react';
import { Target, AlertTriangle, Shield, CheckCircle2, Zap } from 'lucide-react';
import { AGO_2026_TOURNAMENT } from '../data/ago2026Rules';

export default function TargetZoneViewer({ selectedDivision }) {
  const [activeZone, setActiveZone] = useState('deep');

  const zoneData = AGO_2026_TOURNAMENT.scoringZones;
  const currentZone = zoneData[activeZone];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Target size={22} color="var(--text-gold)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            AGO 2026 Target Zones & Hit Quality Specifications
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Interactive scoring anatomy model for Atlantic Gathering Open 2026. Select or click a target zone to see point values and mechanics.
        </p>

        {/* Zone Selector Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveZone('deep')}
            className={`btn ${activeZone === 'deep' ? 'btn-gold' : 'btn-outline'}`}
          >
            Deep Target (3 Pts)
          </button>

          <button
            onClick={() => setActiveZone('shallow')}
            className={`btn ${activeZone === 'shallow' ? 'btn-gold' : 'btn-outline'}`}
          >
            Shallow Target (2 Pts)
          </button>

          <button
            onClick={() => setActiveZone('low')}
            className={`btn ${activeZone === 'low' ? 'btn-gold' : 'btn-outline'}`}
          >
            Extremity Target (1 Pt)
          </button>

          <button
            onClick={() => setActiveZone('forbidden')}
            className={`btn ${activeZone === 'forbidden' ? 'btn-gold' : 'btn-outline'}`}
            style={{ borderColor: activeZone === 'forbidden' ? 'var(--accent-crimson)' : 'rgba(239,68,68,0.4)', color: activeZone === 'forbidden' ? '#fff' : '#fca5a5' }}
          >
            Forbidden Target (Penalty)
          </button>
        </div>

        {/* Two-column layout: SVG Anatomical Diagram & Detail Card */}
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Anatomical Fencer Target Diagram */}
          <div style={{
            background: '#0d1322',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-muted)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            
            <svg width="240" height="340" viewBox="0 0 240 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Glow Ring */}
              <circle cx="120" cy="170" r="140" fill="url(#bgGlow)" opacity="0.1" />

              <defs>
                <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Head / Mask (Deep - 3 Pts) */}
              <path
                d="M100 40 C100 20, 140 20, 140 40 C140 65, 100 65, 100 40 Z"
                fill={activeZone === 'deep' ? '#f59e0b' : '#374151'}
                stroke="#f59e0b"
                strokeWidth={activeZone === 'deep' ? "3" : "1.5"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('deep')}
              />
              <text x="120" y="44" textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">HEAD</text>

              {/* Gorget / Neck (Low - 1 Pt) */}
              <rect
                x="110" y="66" width="20" height="12" rx="4"
                fill={activeZone === 'low' ? '#10b981' : '#374151'}
                stroke="#10b981"
                strokeWidth={activeZone === 'low' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('low')}
              />

              {/* Torso / Chest (Deep - 3 Pts) */}
              <path
                d="M85 82 L155 82 L145 170 L95 170 Z"
                fill={activeZone === 'deep' ? '#f59e0b' : '#374151'}
                stroke="#f59e0b"
                strokeWidth={activeZone === 'deep' ? "3" : "1.5"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('deep')}
              />
              <text x="120" y="125" textAnchor="middle" fill="#000" fontSize="11" fontWeight="bold">TORSO (3 Pts)</text>

              {/* Spine Line (Forbidden) */}
              <line
                x1="120" y1="85" x2="120" y2="165"
                stroke={activeZone === 'forbidden' ? '#ef4444' : 'rgba(239,68,68,0.5)'}
                strokeWidth={activeZone === 'forbidden' ? "5" : "3"}
                strokeDasharray="4 2"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveZone('forbidden')}
              />

              {/* Arms (Shallow - 2 Pts) */}
              <path
                d="M85 85 L60 140 L45 190 L58 195 L72 145 L92 90 Z"
                fill={activeZone === 'shallow' ? '#3b82f6' : '#374151'}
                stroke="#3b82f6"
                strokeWidth={activeZone === 'shallow' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('shallow')}
              />
              <path
                d="M155 85 L180 140 L195 190 L182 195 L168 145 L148 90 Z"
                fill={activeZone === 'shallow' ? '#3b82f6' : '#374151'}
                stroke="#3b82f6"
                strokeWidth={activeZone === 'shallow' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('shallow')}
              />

              {/* Hands & Gloves (Low - 1 Pt) */}
              <circle
                cx="42" cy="202" r="10"
                fill={activeZone === 'low' ? '#10b981' : '#374151'}
                stroke="#10b981"
                strokeWidth={activeZone === 'low' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('low')}
              />
              <circle
                cx="198" cy="202" r="10"
                fill={activeZone === 'low' ? '#10b981' : '#374151'}
                stroke="#10b981"
                strokeWidth={activeZone === 'low' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('low')}
              />

              {/* Legs (Shallow - 2 Pts) */}
              <path
                d="M95 172 L112 172 L108 270 L90 270 Z"
                fill={activeZone === 'shallow' ? '#3b82f6' : '#374151'}
                stroke="#3b82f6"
                strokeWidth={activeZone === 'shallow' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('shallow')}
              />
              <path
                d="M128 172 L145 172 L150 270 L132 270 Z"
                fill={activeZone === 'shallow' ? '#3b82f6' : '#374151'}
                stroke="#3b82f6"
                strokeWidth={activeZone === 'shallow' ? "2.5" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('shallow')}
              />

              {/* Feet (Low - 1 Pt) */}
              <rect
                x="84" y="272" width="26" height="14" rx="4"
                fill={activeZone === 'low' ? '#10b981' : '#374151'}
                stroke="#10b981"
                strokeWidth={activeZone === 'low' ? "2" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('low')}
              />
              <rect
                x="130" y="272" width="26" height="14" rx="4"
                fill={activeZone === 'low' ? '#10b981' : '#374151'}
                stroke="#10b981"
                strokeWidth={activeZone === 'low' ? "2" : "1"}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveZone('low')}
              />
            </svg>

          </div>

          {/* Zone Specification Card */}
          <div style={{ background: '#131c2e', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: `1px solid ${currentZone.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge" style={{ background: `${currentZone.color}22`, color: currentZone.color, border: `1px solid ${currentZone.color}` }}>
                {currentZone.label}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: currentZone.color }}>
                {currentZone.points > 0 ? `+${currentZone.points} Point(s)` : '0 Pts (Penalty)'}
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>
              Valid Anatomical Targets:
            </h3>
            
            <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {currentZone.areas.map((area, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-steel)' }}>
                  <CheckCircle2 size={16} color={currentZone.color} /> {area}
                </li>
              ))}
            </ul>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-muted)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} /> Official AGO 2026 Hit Mechanics:
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Strikes to this target must satisfy quality standards: Cut requires 45° rotation & edge alignment; Thrust requires visible blade flex; Slice requires 12" sliding pressure under weight.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
