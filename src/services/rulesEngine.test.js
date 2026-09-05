import { describe, it, expect } from 'vitest';
import { queryAGORules, parseRulebookPassages } from './rulesEngine.js';
import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data.js';

describe('HEMA Rules Q&A Search Relevance Engine', () => {
  it('parses rawText into structured passages with headings', () => {
    const generalRules = HEMA_SCORECARD_EVENT_908.find(r => r.id === '696');
    const passages = parseRulebookPassages(generalRules);
    expect(passages.length).toBeGreaterThan(5);

    const pommelPassage = passages.find(p => p.heading.toLowerCase().includes('pommel strikes') || p.text.toLowerCase().includes('pommel strikes are only valid'));
    expect(pommelPassage).toBeDefined();
  });

  it('Acceptance Query 1: "Can I pommel strike the mask?" returns pommel/mask passage', () => {
    const result = queryAGORules('Can I pommel strike the mask?', 'all', 'all');
    expect(result.hasMatch).toBe(true);
    expect(result.passages.length).toBeGreaterThan(0);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();
    const heading = topPassage.heading.toLowerCase();

    // Must be directly related to pommel strikes
    const isPommelRelated = topText.includes('pommel') || heading.includes('pommel');
    expect(isPommelRelated).toBe(true);
    expect(topPassage.matchReason).toContain('Pommel');
  });

  it('Acceptance Query 2: "What happens if someone turns their back?" returns spine/back-of-head passage', () => {
    const result = queryAGORules('What happens if someone turns their back?', 'all', 'all');
    expect(result.hasMatch).toBe(true);
    expect(result.passages.length).toBeGreaterThan(0);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();

    // Must return spine / back of head / turned back safety rule
    const isBackRelated = topText.includes('spine') || topText.includes('back of the head') || topText.includes('turns the back');
    expect(isBackRelated).toBe(true);
  });

  it('Acceptance Query 3: "Do gloves count as target?" returns equipment or target-zone passage', () => {
    const result = queryAGORules('Do gloves count as target?', 'all', 'all');
    expect(result.hasMatch).toBe(true);
    expect(result.passages.length).toBeGreaterThan(0);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();
    const heading = topPassage.heading.toLowerCase();

    // Must relate to target areas (hands/gloves) or equipment specs
    const isGlovesTarget = topText.includes('gloves') || topText.includes('hand') || heading.includes('target') || heading.includes('equipment');
    expect(isGlovesTarget).toBe(true);
  });

  it('Acceptance Query 4: "What if we both hit each other?" returns double-hit rules', () => {
    const result = queryAGORules('What if we both hit each other?', 'all', 'all');
    expect(result.hasMatch).toBe(true);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();
    const heading = topPassage.heading.toLowerCase();

    // Must return double hits rules
    const isDoubleRelated = topText.includes('double hit') || heading.includes('double hits');
    expect(isDoubleRelated).toBe(true);
  });

  it('Acceptance Query 5: "I hit head and they hit my arm after" returns afterblow scoring rules', () => {
    const result = queryAGORules('I hit head and they hit my arm after', 'all', 'all');
    expect(result.hasMatch).toBe(true);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();
    const heading = topPassage.heading.toLowerCase();

    // Must return afterblow rules
    const isAfterblowRelated = topText.includes('afterblow') || heading.includes('afterblow');
    expect(isAfterblowRelated).toBe(true);
  });

  it('Acceptance Query 6: "What happens if I step out after hitting?" returns ring-out rules', () => {
    const result = queryAGORules('What happens if I step out after hitting?', 'all', 'all');
    expect(result.hasMatch).toBe(true);

    const topPassage = result.passages[0];
    const topText = topPassage.passageText.toLowerCase();
    const heading = topPassage.heading.toLowerCase();

    // Must return ring-out rules
    const isRingOutRelated = topText.includes('ring out') || topText.includes('ring') || heading.includes('ring out');
    expect(isRingOutRelated).toBe(true);
  });

  it('relevance thresholding: nonsensical or garbage input returns no match', () => {
    const result = queryAGORules('xyzkjhgf random nonsense text 12345', 'all', 'all');
    expect(result.hasMatch).toBe(false);
    expect(result.passages.length).toBe(0);
  });

  it('limits top results to maximum 5 and includes both ruleset name and section heading context', () => {
    const result = queryAGORules('target hit points scoring', 'all', 'all');
    expect(result.passages.length).toBeLessThanOrEqual(5);
    
    result.passages.forEach(passage => {
      expect(passage.rulesetName).toBeDefined();
      expect(passage.rulesetName.length).toBeGreaterThan(0);
      expect(passage.heading).toBeDefined();
      expect(passage.heading.length).toBeGreaterThan(0);
    });
  });

  it('highlights the most relevant sentence with AI passage mark tag inside paragraph', () => {
    const result = queryAGORules('Can I pommel strike the mask?', 'all', 'all');
    const topPassage = result.passages[0];
    expect(topPassage.highlightedText).toContain('ai-highlight-passage');
  });
});
