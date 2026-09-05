import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ExternalLink, HelpCircle, ArrowRight, Tag, AlertCircle } from 'lucide-react';
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
            placeholder="Ask any rules question (e.g. 'Can I pommel strike the mask?', 'What if someone turns their back?')..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
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

      {/* CLARIFICATION REQUIRED PROMPT (Multi-Ruleset Ambiguity) */}
      {searchResult && searchResult.requiresRulesetClarification && (
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

      {/* RELEVANT RULEBOOK TEXT PASSAGES DISPLAY */}
      {searchResult && !searchResult.requiresRulesetClarification && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {searchResult.passages.length > 0 ? (
            searchResult.passages.slice(0, 5).map((item, idx) => (
              <div key={idx} className="glass-panel gold-border animate-fade-in" style={{ padding: '1.25rem' }}>
                
                {/* Header: Ruleset Name, Section Heading, Result Index & Official Permalink */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem', paddingBottom: '0.55rem', borderBottom: '1px solid var(--border-muted)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        📜 Ruleset: {item.rulesetName} (r={item.rulesetId})
                      </span>
                      <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                        📍 Section: {item.heading}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        #{idx + 1} of {Math.min(searchResult.passages.length, 5)}
                      </span>
                    </div>
                    {item.matchReason && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Tag size={12} /> {item.matchReason}
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '0.25rem' }}
                  >
                    <ExternalLink size={13} /> Full Rules Document
                  </a>
                </div>

                {/* Body: Full Paragraph with Sentence-Level Google AI Highlight */}
                <div style={{ background: '#0e1626', padding: '1.1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--accent-gold)' }}>
                  <div
                    style={{ fontSize: '0.925rem', color: '#e2e8f0', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: item.highlightedText }}
                  />
                </div>

              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <AlertCircle size={28} color="var(--accent-gold)" />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.4rem' }}>No Strong Rule Match Found</h3>
              <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-steel)' }}>
                No official rule passages matched your query with sufficient confidence. Try phrasing your question with specific terms (e.g. "pommel", "turns back", "gloves", "double hit", "afterblow", "step out").
              </p>
            </div>
          )}
        </div>
      )}

      {/* Default Prompt when search is empty */}
      {!query && (
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Type any rules question above to locate and display the exact relevant text passages from the official rules.
          </p>
        </div>
      )}

    </div>
  );
}
