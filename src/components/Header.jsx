import React from 'react';
import { Shield, HelpCircle, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data';

export default function Header({ 
  selectedEvent,
  onSelectEvent,
  selectedRuleset, 
  onSelectRuleset,
  selectedTier,
  onSelectTier,
  activeTab, 
  onTabChange 
}) {
  const tabs = [
    { id: 'qa', label: 'Q&A Search', icon: HelpCircle },
    { id: 'explorer', label: 'Official Rules', icon: BookOpen }
  ];

  const currentRulesetObj = HEMA_SCORECARD_EVENT_908.find(r => r.id === selectedRuleset);

  return (
    <header style={{ marginBottom: '1.25rem' }}>
      
      {/* Compact Banner Header with Cropped Base Image */}
      <div className="glass-panel gold-border" style={{ overflow: 'hidden', padding: 0, marginBottom: '0.75rem', position: 'relative' }}>
        
        {/* Header Image Overlay - Compact height */}
        <div style={{ position: 'relative', width: '100%', height: '100px', background: '#000' }}>
          <img
            src="/man_in_chair_header.jpg"
            alt="I didn't Check HEMA Scorecard"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              opacity: '0.65',
              filter: 'brightness(0.85) contrast(1.1)'
            }}
          />

          {/* Dark Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.65) 50%, rgba(9, 13, 22, 0.9) 100%)'
          }} />

          {/* Title - Compact without super/sub headers */}
          <div style={{
            position: 'absolute',
            inset: 0,
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
              fontWeight: '900',
              color: '#fff',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              letterSpacing: '0.01em'
            }}>
              I didn't Check <span style={{ color: 'var(--text-gold)' }}>HEMA Scorecard</span>
            </h1>
          </div>
        </div>

        {/* Controls Bar: Event Dropdown & Ruleset Dropdown */}
        <div style={{
          background: '#0e1626',
          padding: '0.65rem 1rem',
          borderTop: '1px solid var(--border-muted)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.6rem'
        }}>
          
          {/* Event Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.825rem', color: 'var(--text-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={15} /> Event:
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => onSelectEvent(e.target.value)}
              style={{
                background: '#1f2937',
                color: '#fff',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.825rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="AGO 26">AGO 26 (Atlantic Gathering Open 2026)</option>
            </select>
          </div>

          {/* Match Ruleset Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.825rem', color: 'var(--text-steel)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shield size={15} color="var(--accent-gold)" /> Match Ruleset:
            </label>
            <select
              value={selectedRuleset}
              onChange={(e) => onSelectRuleset(e.target.value)}
              style={{
                background: '#1f2937',
                color: '#fff',
                border: '1px solid var(--border-gold)',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.825rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Auto-Detect / Cross-Reference All</option>
              {HEMA_SCORECARD_EVENT_908.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} (r={r.id})
                </option>
              ))}
            </select>

            {currentRulesetObj && (
              <a
                href={currentRulesetObj.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', gap: '0.25rem' }}
              >
                <ExternalLink size={12} /> Link
              </a>
            )}
          </div>

        </div>

      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} color={isActive ? 'var(--text-gold)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
