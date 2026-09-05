import React from 'react';
import { Shield, HelpCircle, Target, Calculator, BookOpen, ClipboardList, ExternalLink, Calendar } from 'lucide-react';
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
    { id: 'qa', label: 'Q&A Clarifications', icon: HelpCircle },
    { id: 'target-map', label: 'Target Map', icon: Target },
    { id: 'simulator', label: 'Simulator', icon: Calculator },
    { id: 'explorer', label: 'Official Rules', icon: BookOpen },
    { id: 'cheatsheet', label: 'Referee Cheat Sheet', icon: ClipboardList }
  ];

  const currentRulesetObj = HEMA_SCORECARD_EVENT_908.find(r => r.id === selectedRuleset);

  return (
    <header style={{ marginBottom: '1.5rem' }}>
      
      {/* Base Image Banner Header */}
      <div className="glass-panel gold-border" style={{ overflow: 'hidden', padding: 0, marginBottom: '1rem', position: 'relative' }}>
        
        {/* Header Image Background Overlay */}
        <div style={{ position: 'relative', width: '100%', height: '190px', background: '#000' }}>
          <img
            src="/man_in_chair_header.jpg"
            alt="I didn't Check HEMA Scorecard"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              opacity: '0.68',
              filter: 'brightness(0.9) contrast(1.1)'
            }}
          />

          {/* Dark Gradient Overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.6) 50%, rgba(9, 13, 22, 0.85) 100%), linear-gradient(to top, rgba(9, 13, 22, 1) 0%, transparent 60%)'
          }} />

          {/* Banner Title Content */}
          <div style={{
            position: 'absolute',
            inset: 0,
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justify: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-gold">Official Rules Assistant</span>
              <span className="badge badge-blue">HEMAScorecard Event 908</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: '900',
              color: '#fff',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              letterSpacing: '0.01em'
            }}>
              I didn't Check <span style={{ color: 'var(--text-gold)' }}>HEMA Scorecard</span>
            </h1>

            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.2rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              Instant tournament rules clarification & referee engine
            </p>
          </div>
        </div>

        {/* Minimal Controls Bar: Event Dropdown & Ruleset Dropdown */}
        <div style={{
          background: '#0e1626',
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--border-muted)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}>
          
          {/* Left: Event Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} /> Event:
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => onSelectEvent(e.target.value)}
              style={{
                background: '#1f2937',
                color: '#fff',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="AGO 26">AGO 26 (Atlantic Gathering Open 2026)</option>
            </select>
          </div>

          {/* Right: Active Match Ruleset Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-steel)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={16} color="var(--accent-gold)" /> Match Ruleset:
            </label>
            <select
              value={selectedRuleset}
              onChange={(e) => onSelectRuleset(e.target.value)}
              style={{
                background: '#1f2937',
                color: '#fff',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
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
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', gap: '0.3rem' }}
              >
                <ExternalLink size={13} /> Link
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
              <Icon size={17} color={isActive ? 'var(--text-gold)' : 'var(--text-muted)'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
