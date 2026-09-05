import React, { useState } from 'react';
import { Calculator, Award, AlertOctagon, CheckCircle2, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { calculateExchangeOutcome } from '../services/rulesEngine';

export default function ScenarioSimulator() {
  const [initialHit, setInitialHit] = useState('head');
  const [afterblowHit, setAfterblowHit] = useState('shallow');
  const [isDouble, setIsDouble] = useState(false);
  const [isTakedown, setIsTakedown] = useState(false);
  const [isDisarm, setIsDisarm] = useState(false);
  const [isPommelFace, setIsPommelFace] = useState(false);
  const [isRingOutFleeing, setIsRingOutFleeing] = useState(false);
  const [doubleCount, setDoubleCount] = useState(0);

  const outcome = calculateExchangeOutcome({
    initialHitTarget: initialHit,
    afterblowTarget: afterblowHit,
    isDoubleHit: isDouble,
    isTakedown,
    isDisarm,
    isPommelToFace: isPommelFace,
    isRingOutFleeing,
    currentDoubleCount: doubleCount
  });

  const handleReset = () => {
    setInitialHit('head');
    setAfterblowHit('none');
    setIsDouble(false);
    setIsTakedown(false);
    setIsDisarm(false);
    setIsPommelFace(false);
    setIsRingOutFleeing(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={22} color="var(--text-gold)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Ringside Exchange Outcome Calculator
            </h2>
          </div>
          <button onClick={handleReset} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
            <RefreshCw size={14} /> Reset Exchange
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configure exchange variables (initial hit, 1-tempo afterblow, takedown, ringout, pommel strike) to calculate official AGO 2026 score calls live at ring side.
        </p>

        <div className="grid-2">
          
          {/* Controls Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Initial Strike (Fighter A) */}
            <div style={{ background: '#131c2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-gold)', display: 'block', marginBottom: '0.5rem' }}>
                1. Fighter A Initial Strike:
              </label>
              <select
                value={initialHit}
                disabled={isDouble}
                onChange={(e) => setInitialHit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: '#0a0f1d',
                  color: '#fff',
                  border: '1px solid var(--border-steel)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontWeight: '600'
                }}
              >
                <option value="head">Head / Torso (Deep Target - 3 Pts)</option>
                <option value="shallow">Arm / Leg (Shallow Target - 2 Pts)</option>
                <option value="low">Hand / Foot (Extremity Target - 1 Pt)</option>
                <option value="none">No Hit / Clean Defense (0 Pts)</option>
              </select>
            </div>

            {/* Afterblow (Fighter B) */}
            <div style={{ background: '#131c2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#93c5fd', display: 'block', marginBottom: '0.5rem' }}>
                2. Fighter B 1-Tempo Afterblow:
              </label>
              <select
                value={afterblowHit}
                disabled={isDouble}
                onChange={(e) => setAfterblowHit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: '#0a0f1d',
                  color: '#fff',
                  border: '1px solid var(--border-steel)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontWeight: '600'
                }}
              >
                <option value="none">No Afterblow / Late Afterblow (0 Pts)</option>
                <option value="head">Head / Torso (Deep Target - 3 Pts)</option>
                <option value="shallow">Arm / Leg (Shallow Target - 2 Pts)</option>
                <option value="low">Hand / Foot (Extremity Target - 1 Pt)</option>
              </select>
            </div>

            {/* Modifiers & Actions */}
            <div style={{ background: '#131c2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'block', marginBottom: '0.75rem' }}>
                3. Exchange Modifiers & Penalties:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isDouble}
                    onChange={(e) => setIsDouble(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-crimson)' }}
                  />
                  <span>Simultaneous Double Hit (Both landed together)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isTakedown}
                    onChange={(e) => setIsTakedown(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Fighter A Controlled Takedown (+2 Pts)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isDisarm}
                    onChange={(e) => setIsDisarm(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Fighter A Clean Weapon Disarm (+2 Pts)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isRingOutFleeing}
                    onChange={(e) => setIsRingOutFleeing(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-blue)' }}
                  />
                  <span>Fighter A Step-Out / Fleeing Ring Out (+1 Pt to Fighter B)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', color: '#fca5a5' }}>
                  <input
                    type="checkbox"
                    checked={isPommelFace}
                    onChange={(e) => setIsPommelFace(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-crimson)' }}
                  />
                  <span>Pommel Strike to Mask / Face (FORBIDDEN)</span>
                </label>
              </div>
            </div>

            {/* Current Double Hit Counter */}
            <div style={{ background: '#131c2e', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-steel)', fontWeight: '600' }}>
                Match Double Hits Record:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[0, 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setDoubleCount(num)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: doubleCount === num ? (num >= 3 ? 'var(--accent-crimson)' : 'var(--accent-gold)') : '#1f2937',
                      color: doubleCount === num ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Outcome Display Card */}
          <div className="gold-border" style={{
            background: 'linear-gradient(145deg, #111827 0%, #0d1322 100%)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className={`badge ${outcome.verdictType === 'penalty' || outcome.verdictType === 'disqualify' ? 'badge-crimson' : 'badge-gold'}`}>
                  Official Referee Call
                </span>
                <span className="rule-tag">{outcome.ruleCitation}</span>
              </div>

              <h3 style={{ fontSize: '1.4rem', color: outcome.verdictType === 'penalty' ? 'var(--accent-crimson)' : '#fff', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.4' }}>
                {outcome.callSummary}
              </h3>

              {/* Score Points Breakdown Display */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0', padding: '1rem', background: '#070b14', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-muted)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 600, textTransform: 'uppercase' }}>Fighter A (Red)</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: outcome.fighterAScore > 0 ? 'var(--accent-gold)' : '#4b5563' }}>
                    +{outcome.fighterAScore}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 600, textTransform: 'uppercase' }}>Fighter B (Blue)</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: outcome.fighterBScore > 0 ? '#93c5fd' : '#4b5563' }}>
                    +{outcome.fighterBScore}
                  </div>
                </div>
              </div>

              {/* Warning / Card Alerts */}
              {outcome.warnings.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '1rem', borderRadius: '8px' }}>
                  {outcome.warnings.map((w, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: '0.875rem' }}>
                      <AlertOctagon size={16} /> {w}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Note: AGO 2026 rule AGO-4.2 mandates net score calculation. Equal points negate to 0 pts.
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
