import React, { useState } from 'react';
import Header from './components/Header';
import RulesQA from './components/RulesQA';
import RuleExplorer from './components/RuleExplorer';
import { Shield } from 'lucide-react';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState('AGO 26');
  const [selectedRuleset, setSelectedRuleset] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [activeTab, setActiveTab] = useState('qa');

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Header
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        selectedRuleset={selectedRuleset}
        onSelectRuleset={setSelectedRuleset}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Tab Content */}
      <main>
        {activeTab === 'qa' && (
          <RulesQA
            selectedRuleset={selectedRuleset}
            onSelectRuleset={setSelectedRuleset}
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
          />
        )}

        {activeTab === 'explorer' && (
          <RuleExplorer
            selectedRuleset={selectedRuleset}
            onSelectRuleset={setSelectedRuleset}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-muted)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} color="var(--accent-gold)" />
          <span>I didn't Check HEMA Scorecard • {selectedEvent} (Event 908)</span>
        </div>
        <div>
          Rules Assistant & Multi-Ruleset Cross-Reference Engine
        </div>
      </footer>
    </div>
  );
}
