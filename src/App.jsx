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

      {/* Footer Disclaimer */}
      <footer style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-muted)',
        display: 'flex',
        justify: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Shield size={16} color="var(--accent-gold)" />
          <span>
            This tool uses the most energy and water efficient AI tool I could find so it can make mistakes. When in doubt, check the rules on HEMA Scorecard.
          </span>
        </div>
      </footer>
    </div>
  );
}
