import React, { useState, useEffect } from 'react';
import { Search, Sparkles, HelpCircle, ExternalLink, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { queryAGORules } from '../services/rulesEngine';

export default function RulesQA({ selectedRuleset, onSelectRuleset, selectedTier, onSelectTier }) {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    if (query.trim()) {
      const res = queryAGORules(query, selectedRuleset, selectedTier);
      setSearchResult(res);
    } else {
      setSearchResult(null);
    }
  }, [query, selectedRuleset, selectedTier]);

  const handleClarificationOption = (rulesetId, tierId = null) => {
    if (rulesetId) onSelectRuleset(rulesetId);
    if (tierId) onSelectTier(tierId);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Search Input Box */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={20} color="var(--text-gold)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Q&A Rules Search
          </h2>
        </div>

        {/* Input Box */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules (e.g. 'pommel', 'afterblow timing', 'flex limit', 'ring out', 'takedown', 'gloves')..."
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.75rem',
              background: '#0d1322',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.95rem',
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
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CLARIFICATION REQUIRED PROMPT (Ruleset Ambiguity or Tier Ambiguity) */}
      {searchResult && (searchResult.requiresRulesetClarification || searchResult.requiresTierClarification) && (
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <HelpCircle size={24} color="var(--text-gold)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '800', margin: 0 }}>
              {searchResult.clarificationPrompt.title}
            </h3>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-steel)', marginBottom: '1rem', lineHeight: '1.5' }}>
            {searchResult.clarificationPrompt.message}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {searchResult.clarificationPrompt.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleClarificationOption(opt.rulesetId || opt.id, opt.id.includes('tier') ? opt.id : null)}
                className="btn btn-gold"
                style={{ fontSize: '0.85rem', gap: '0.35rem', padding: '0.5rem 0.85rem' }}
              >
                <span>{opt.label}</span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRIMARY MATCHED RULE PASSAGE DISPLAY & HIGHLIGHTING */}
      {searchResult && searchResult.topVerdict && !searchResult.requiresRulesetClarification && !searchResult.requiresTierClarification && (
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.5rem' }}>
          
          {/* Passage Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-muted)' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.35rem' }}>
                Most Relevant Rule Passage
              </span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-gold)', fontWeight: '800', marginTop: '0.15rem' }}>
                {searchResult.topVerdict.verdict}
              </h3>
            </div>
            
            <div>
              <a
                href={searchResult.topVerdict.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.3rem' }}
              >
                <ExternalLink size={14} /> Open Permalink
              </a>
            </div>
          </div>

          {/* Highlighted Relevant Passage Text */}
          <div style={{ background: '#0e1626', padding: '1.25rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-gold)', marginBottom: '1.25rem' }}>
            <div
              style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: '1.75', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: searchResult.topVerdict.highlightedPassage }}
            />
          </div>

          {/* Additional Relevant Passages */}
          {searchResult.results.length > 1 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={16} color="var(--accent-gold)" /> Additional Relevant Rule Passages ({searchResult.results.length - 1})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {searchResult.results.slice(1, 5).map((item, idx) => (
                  <div key={idx} style={{ background: '#141d30', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-gold)', fontSize: '0.9rem' }}>
                        {item.rulesetName} (r={item.rulesetId})
                      </span>
                      <a
                        href={item.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-chip"
                        style={{ fontSize: '0.75rem', gap: '0.25rem' }}
                      >
                        Permalink <ExternalLink size={12} />
                      </a>
                    </div>
                    <div
                      style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                      dangerouslySetInnerHTML={{ __html: item.highlightedPassage }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Default Prompt when search is empty */}
      {!query && (
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Type any rule question or term above to locate and highlight the exact relevant passage in official HEMAScorecard rulesets.
          </p>
        </div>
      )}

    </div>
  );
}
