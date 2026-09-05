import React, { useState, useEffect } from 'react';
import { Search, Sparkles, HelpCircle, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';
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
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <Sparkles size={18} color="var(--text-gold)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Q&A Rules Search
          </h2>
        </div>

        {/* Input Box */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules (e.g. 'pommel', 'afterblow timing', 'flex limit', 'ring out', 'takedown', 'gloves')..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: '#0d1322',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.925rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '0.85rem',
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
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={22} color="var(--text-gold)" />
            <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: '800', margin: 0 }}>
              {searchResult.clarificationPrompt.title}
            </h3>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-steel)', marginBottom: '0.85rem', lineHeight: '1.5' }}>
            {searchResult.clarificationPrompt.message}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {searchResult.clarificationPrompt.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleClarificationOption(opt.rulesetId || opt.id, opt.id.includes('tier') ? opt.id : null)}
                className="btn btn-gold"
                style={{ fontSize: '0.825rem', gap: '0.3rem', padding: '0.45rem 0.85rem' }}
              >
                <span>{opt.label}</span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRIMARY MATCHED RULE PASSAGE DISPLAY & HIGHLIGHTING */}
      {searchResult && searchResult.topVerdict && !searchResult.requiresRulesetClarification && !searchResult.requiresTierClarification && (
        <div className="glass-panel gold-border animate-fade-in" style={{ padding: '1.25rem' }}>
          
          {/* Passage Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-muted)' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.25rem' }}>
                Most Relevant Rule Passage
              </span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-gold)', fontWeight: '800', marginTop: '0.1rem' }}>
                {searchResult.topVerdict.verdict}
              </h3>
            </div>
            
            <div>
              <a
                href={searchResult.topVerdict.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem', gap: '0.25rem' }}
              >
                <ExternalLink size={13} /> Open Permalink
              </a>
            </div>
          </div>

          {/* Highlighted Relevant Passage Text */}
          <div style={{ background: '#0e1626', padding: '1.1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-gold)', marginBottom: '1rem' }}>
            <div
              style={{ fontSize: '0.925rem', color: '#e2e8f0', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: searchResult.topVerdict.highlightedPassage }}
            />
          </div>

          {/* Additional Relevant Passages */}
          {searchResult.results.length > 1 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={15} color="var(--accent-gold)" /> Additional Relevant Rule Passages ({searchResult.results.length - 1})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {searchResult.results.slice(1, 5).map((item, idx) => (
                  <div key={idx} style={{ background: '#141d30', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-gold)', fontSize: '0.875rem' }}>
                        {item.rulesetName} (r={item.rulesetId})
                      </span>
                      <a
                        href={item.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-chip"
                        style={{ fontSize: '0.725rem', gap: '0.2rem' }}
                      >
                        Permalink <ExternalLink size={11} />
                      </a>
                    </div>
                    <div
                      style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
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
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Type any rule question or term above to locate and highlight the exact relevant passage in official HEMAScorecard rulesets.
          </p>
        </div>
      )}

    </div>
  );
}
