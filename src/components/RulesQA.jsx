import React, { useState, useEffect } from 'react';
import { Search, Sparkles, HelpCircle, ExternalLink, BookOpen, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { queryAGORules } from '../services/rulesEngine';

export default function RulesQA({ selectedRuleset, onSelectRuleset, selectedTier, onSelectTier }) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const presetQuestions = [
    'How do team scores work in Longsword Relay vs Aggregate Award?',
    'What is the difference between Tier-A and Tier-B in Longsword Relay?',
    'Are pommel strikes scoring in Messer vs Individual Longsword?',
    'What is the maximum blade length and flex limit for Longsword?',
    'How do static vs dynamic patterns differ in Longsword Cutting?',
    'What equipment is explicitly forbidden (e.g. gloves/armor)?'
  ];

  useEffect(() => {
    if (query.trim()) {
      const res = queryAGORules(query, selectedRuleset, selectedTier);
      setSearchResult(res);
    } else {
      setSearchResult(null);
    }
  }, [query, selectedRuleset, selectedTier]);

  const handleChipClick = (qText) => {
    setQuery(qText);
  };

  const handleClarificationOption = (rulesetId, tierId = null) => {
    if (rulesetId) onSelectRuleset(rulesetId);
    if (tierId) onSelectTier(tierId);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search Input Box */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="var(--text-gold)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            AG Open 2026 Rules Clarification Engine
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Ask rules questions across Code of Conduct (r=695), General Rules (r=696), Individual Longsword (r=697), Relay (r=698), Messer (r=699), Cutting (r=700), or Aggregate Award (r=701).
        </p>

        {/* Input Box */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search 
            size={22} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any rule question (e.g. 'relay tier differences', 'messer pommel scoring', 'blade flex limit')..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 3rem',
              background: '#0d1322',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Preset Question Chips */}
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-steel)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            Frequently Asked Tournament Questions:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(q)}
                className="btn-chip"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLARIFICATION REQUIRED PROMPT (Ruleset Ambiguity or Tier Ambiguity) */}
      {searchResult && (searchResult.requiresRulesetClarification || searchResult.requiresTierClarification) && (
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(17, 24, 39, 0.9) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <HelpCircle size={26} color="var(--text-gold)" />
            <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: '800', margin: 0 }}>
              {searchResult.clarificationPrompt.title}
            </h3>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-steel)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            {searchResult.clarificationPrompt.message}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {searchResult.clarificationPrompt.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleClarificationOption(opt.rulesetId || opt.id, opt.id.includes('tier') ? opt.id : null)}
                className="btn btn-gold"
                style={{ fontSize: '0.9rem', gap: '0.4rem' }}
              >
                <span>{opt.label}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRIMARY VERDICT CARD & PERMALINK CITATIONS */}
      {searchResult && searchResult.topVerdict && !searchResult.requiresRulesetClarification && !searchResult.requiresTierClarification && (
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.75rem' }}>
          
          {/* Verdict Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-muted)' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                Official Tournament Ruling
              </span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-gold)', fontWeight: '800', marginTop: '0.2rem' }}>
                {searchResult.topVerdict.verdict}
              </h3>
            </div>
            
            <div>
              <a
                href={searchResult.topVerdict.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
              >
                <ExternalLink size={16} /> Official HEMAScorecard Permalink
              </a>
            </div>
          </div>

          {/* Verdict Details & Text Snippet */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-gold)', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>
              Summary & Category: {searchResult.topVerdict.summary}
            </h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-steel)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              "{searchResult.topVerdict.snippet}"
            </p>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Active Tier Scope: <strong style={{ color: 'var(--text-gold)' }}>{searchResult.topVerdict.tierApplied}</strong>
            </div>
          </div>

          {/* Matches across other rulesets if relevant */}
          {searchResult.results.length > 1 && (
            <div>
              <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--accent-gold)" /> Additional Ruleset References ({searchResult.results.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {searchResult.results.slice(1).map((item, idx) => (
                  <div key={idx} style={{ background: '#162035', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h5 style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>{item.rulesetName}</h5>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>{item.summary}</p>
                    </div>
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-chip"
                      style={{ fontSize: '0.8rem', gap: '0.3rem' }}
                    >
                      Permalink <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* DEFAULT STATE: Quick Category Cards for 7 Rulebooks */}
      {!query && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-gold)" /> Official Event 908 Rulesets on HEMAScorecard
          </h3>

          <div className="grid-3">
            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=697</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>Individual Longsword</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Max blade 101 cm, max flex 18 kg at cross.KdF cutting mechanics.
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=697" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=698</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>Longsword Relay</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                3-person team. Tier-A (School teams) vs Tier-B (Random pickup teams).
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=698" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=699</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>Messer Rules</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Buckling flex max 19.5 kg. Pommels explicitly non-scoring!
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=699" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=700</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>Longsword Cutting</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Tier-B Static Patterns (Solo cuts) vs Tier-A Dynamic Patterns.
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=700" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=701</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>Aggregate Team Award</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Top 4 = 9 pts, Top 1/3 = 3 pts, Top 1/2 = 1 pt. Individual best counted once.
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=701" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ background: '#131b2e', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-muted)' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>r=696</span>
              <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0.3rem 0' }}>General Sparring</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Equipment checks, pulled attack rules, white cards, ring-out exceptions.
              </p>
              <a href="https://hemascorecard.com/infoRules.php?e=908&r=696" target="_blank" rel="noreferrer" className="btn btn-chip" style={{ fontSize: '0.75rem' }}>
                Permalink <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
