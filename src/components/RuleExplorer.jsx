import React, { useState } from 'react';
import { BookOpen, ChevronRight, ExternalLink, ShieldCheck, Tag } from 'lucide-react';
import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data';

export default function RuleExplorer({ selectedRuleset, onSelectRuleset }) {
  const activeRuleset = HEMA_SCORECARD_EVENT_908.find(r => r.id === selectedRuleset) || HEMA_SCORECARD_EVENT_908[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BookOpen size={22} color="var(--text-gold)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Official AG Open 2026 Tournament Rulebooks (Event 908)
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Browse authentic complete rulebook texts hosted on HEMAScorecard with direct permalink citations.
        </p>

        <div className="grid-2">
          
          {/* Ruleset List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-steel)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Select Tournament Ruleset:
            </span>

            {HEMA_SCORECARD_EVENT_908.map(ruleset => {
              const isSelected = ruleset.id === activeRuleset.id;
              return (
                <button
                  key={ruleset.id}
                  onClick={() => onSelectRuleset(ruleset.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#131b2e',
                    border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-muted)',
                    color: isSelected ? 'var(--text-gold)' : 'var(--text-steel)',
                    fontWeight: isSelected ? '700' : '500',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <span className="rule-tag" style={{ marginRight: '0.5rem' }}>r={ruleset.id}</span>
                    <span style={{ fontSize: '0.9rem' }}>{ruleset.name}</span>
                  </div>
                  <ChevronRight size={18} color={isSelected ? 'var(--text-gold)' : 'var(--text-muted)'} />
                </button>
              );
            })}
          </div>

          {/* Active Ruleset Text Display */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#0e1526', maxHeight: '650px', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-muted)' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.3rem' }}>
                  {activeRuleset.category}
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: '800', margin: 0 }}>
                  {activeRuleset.name}
                </h3>
              </div>
              <a
                href={activeRuleset.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
              >
                <ExternalLink size={14} /> Open Permalink
              </a>
            </div>

            {/* Summary */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-gold)', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-steel)' }}>
              <strong>Category Overview:</strong> {activeRuleset.summary}
            </div>

            {/* Complete Text */}
            <div style={{ background: '#162035', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-muted)', fontSize: '0.9rem', color: '#d1d5db', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {activeRuleset.rawText}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
