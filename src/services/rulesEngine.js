import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data';

/**
 * Intelligent Rules Engine for Atlantic Gathering (AG Open 2026) Event 908
 * Supports automatic ruleset ambiguity detection, Tier-A vs Tier-B clarification, and official permalink citations.
 */

export function queryAGORules(query, selectedRulesetId = 'all', selectedTier = 'all') {
  if (!query || query.trim() === '') {
    return {
      hasMatch: false,
      requiresRulesetClarification: false,
      requiresTierClarification: false,
      clarificationPrompt: null,
      topVerdict: null,
      results: []
    };
  }

  const qLower = query.toLowerCase().trim();
  const words = qLower.split(/\s+/).filter(w => w.length > 2);

  // 1. Detect if query explicitly mentions a ruleset
  let detectedRuleset = null;
  if (qLower.includes('conduct') || qLower.includes('harass') || qLower.includes('safety policy')) {
    detectedRuleset = '695';
  } else if (qLower.includes('relay') || qLower.includes('team longsword') || qLower.includes('pickup')) {
    detectedRuleset = '698';
  } else if (qLower.includes('messer') || qLower.includes('buckling')) {
    detectedRuleset = '699';
  } else if (qLower.includes('cutting') || qLower.includes('tameshigiri') || qLower.includes('pattern') || qLower.includes('mat')) {
    detectedRuleset = '700';
  } else if (qLower.includes('aggregate') || qLower.includes('school point') || qLower.includes('team award')) {
    detectedRuleset = '701';
  } else if (qLower.includes('longsword') && !qLower.includes('relay') && !qLower.includes('cutting')) {
    detectedRuleset = '697';
  }

  const activeRulesetId = selectedRulesetId !== 'all' ? selectedRulesetId : detectedRuleset;

  // 2. Check if Ruleset Clarification is required when user query is multi-ruleset ambiguous
  const isMultiRulesetTopic = 
    (qLower.includes('team') || qLower.includes('point') || qLower.includes('score') || qLower.includes('flex') || qLower.includes('blade') || qLower.includes('tier')) &&
    selectedRulesetId === 'all' && 
    !detectedRuleset;

  if (isMultiRulesetTopic) {
    return {
      hasMatch: true,
      requiresRulesetClarification: true,
      requiresTierClarification: false,
      clarificationPrompt: {
        title: 'Which tournament ruleset are you inquiring about?',
        message: 'Your question touches on rules that differ between tournament divisions at AG Open 2026. Please select the relevant ruleset to receive the exact ruling:',
        options: [
          { id: '697', label: 'Individual Longsword (r=697)', rulesetId: '697', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=697' },
          { id: '698', label: 'Longsword Relay (r=698)', rulesetId: '698', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=698' },
          { id: '699', label: 'Messer (r=699)', rulesetId: '699', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=699' },
          { id: '700', label: 'Longsword Cutting (r=700)', rulesetId: '700', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=700' },
          { id: '701', label: 'Aggregate Team Award (r=701)', rulesetId: '701', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=701' },
          { id: '696', label: 'General Sparring (r=696)', rulesetId: '696', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=696' }
        ]
      },
      topVerdict: null,
      results: []
    };
  }

  // 3. Check if Tier Clarification is required (e.g. Longsword Relay Tier A vs Tier B, Cutting Tier A vs Tier B)
  const isRelayQuery = activeRulesetId === '698' || qLower.includes('relay');
  const isCuttingQuery = activeRulesetId === '700' || qLower.includes('cutting');

  if (selectedTier === 'all' && (isRelayQuery || isCuttingQuery)) {
    if (isRelayQuery && (qLower.includes('team') || qLower.includes('aggregate') || qLower.includes('pickup') || qLower.includes('score') || qLower.includes('composition'))) {
      return {
        hasMatch: true,
        requiresRulesetClarification: false,
        requiresTierClarification: true,
        clarificationPrompt: {
          title: 'Longsword Relay: Clarify Team Tier',
          message: 'Longsword Relay rules differ significantly between Tier-A and Tier-B. Please specify which Tier you are asking about:',
          options: [
            { id: 'tier-a', label: 'Tier-A (School/Club Teams - Counts for Aggregate Award)', rulesetId: '698' },
            { id: 'tier-b', label: 'Tier-B (Random Pickup & Intermediate Teams - Excluded from Aggregate)', rulesetId: '698' }
          ]
        },
        topVerdict: null,
        results: []
      };
    }

    if (isCuttingQuery && (qLower.includes('pattern') || qLower.includes('cut') || qLower.includes('solo') || qLower.includes('dynamic'))) {
      return {
        hasMatch: true,
        requiresRulesetClarification: false,
        requiresTierClarification: true,
        clarificationPrompt: {
          title: 'Longsword Cutting: Clarify Cutting Tier',
          message: 'AG Open Longsword Cutting uses different patterns for Tier-A and Tier-B. Please select the Tier:',
          options: [
            { id: 'tier-a', label: 'Tier-A (Dynamic Cutting Patterns - Feints & Moving Targets)', rulesetId: '700' },
            { id: 'tier-b', label: 'Tier-B (Static Cutting Patterns - Solo Seeding Cuts)', rulesetId: '700' }
          ]
        },
        topVerdict: null,
        results: []
      };
    }
  }

  // 4. Query matching against rulesets
  const targetRulesets = activeRulesetId
    ? HEMA_SCORECARD_EVENT_908.filter(r => r.id === activeRulesetId)
    : HEMA_SCORECARD_EVENT_908;

  const matches = [];

  targetRulesets.forEach(ruleset => {
    const textLower = ruleset.rawText.toLowerCase();
    let score = 0;

    if (textLower.includes(qLower)) score += 15;

    words.forEach(w => {
      if (textLower.includes(w)) score += 3;
    });

    if (score > 2) {
      matches.push({
        rulesetId: ruleset.id,
        rulesetName: ruleset.name,
        permalink: ruleset.permalink,
        category: ruleset.category,
        score,
        summary: ruleset.summary,
        snippet: getRelevantSnippet(ruleset.rawText, words[0] || qLower)
      });
    }
  });

  matches.sort((a, b) => b.score - a.score);

  // Synthesize top verdict
  let topVerdict = null;
  if (matches.length > 0) {
    const top = matches[0];
    topVerdict = {
      verdict: `Official Rule in ${top.rulesetName}`,
      question: query,
      summary: top.summary,
      snippet: top.snippet,
      permalink: top.permalink,
      rulesetId: top.rulesetId,
      tierApplied: selectedTier !== 'all' ? selectedTier.toUpperCase() : 'General'
    };
  } else {
    topVerdict = {
      verdict: 'General Tournament Discretion (r=696)',
      question: query,
      summary: 'No specific clause found. Consult Head Ring Marshal.',
      snippet: 'Event organizers and Head Marshals retain final authority to interpret actions and safety protocols.',
      permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=696',
      rulesetId: '696',
      tierApplied: 'General'
    };
  }

  return {
    hasMatch: matches.length > 0,
    requiresRulesetClarification: false,
    requiresTierClarification: false,
    topVerdict,
    results: matches
  };
}

function getRelevantSnippet(fullText, keyword) {
  if (!fullText) return '';
  const lower = fullText.toLowerCase();
  const idx = lower.indexOf(keyword.toLowerCase());
  if (idx === -1) return fullText.substring(0, 300) + '...';
  
  const start = Math.max(0, idx - 100);
  const end = Math.min(fullText.length, idx + 300);
  return (start > 0 ? '...' : '') + fullText.substring(start, end) + (end < fullText.length ? '...' : '');
}

/**
 * Exchange Outcome Simulator Helper
 */
export function calculateExchangeOutcome({
  initialHitTarget = null,
  afterblowTarget = null,
  isDoubleHit = false,
  isTakedown = false,
  isDisarm = false,
  isPommelToFace = false,
  isRingOutFleeing = false,
  currentDoubleCount = 0
}) {
  const result = {
    fighterAScore: 0,
    fighterBScore: 0,
    callSummary: '',
    verdictType: 'score',
    warnings: [],
    ruleCitation: 'r=696 (General Sparring)'
  };

  if (isPommelToFace) {
    result.verdictType = 'penalty';
    result.callSummary = 'PENALTY: Pommel Strike to Mask / Face is FORBIDDEN';
    result.warnings.push('Yellow Card (-1 Point) awarded for dangerous striking.');
    result.ruleCitation = 'r=696 (Forbidden Actions)';
    return result;
  }

  if (isDoubleHit) {
    const newDoubleCount = currentDoubleCount + 1;
    if (newDoubleCount >= 4) {
      result.verdictType = 'disqualify';
      result.callSummary = 'MATCH TERMINATED: 4th Double Hit - Double Loss!';
      result.warnings.push('Both fighters receive 0 match points in pool standings.');
      result.ruleCitation = 'r=696 (Double Match Loss)';
    } else if (newDoubleCount === 3) {
      result.verdictType = 'double';
      result.callSummary = 'DOUBLE HIT #3: 0 Points & Mandatory Warning!';
      result.warnings.push('3rd Double hit reached. 1 more double results in Double Loss.');
      result.ruleCitation = 'r=696 (3-Double Limit)';
    } else {
      result.verdictType = 'double';
      result.callSummary = `DOUBLE HIT #${newDoubleCount}: 0 Points Awarded`;
      result.ruleCitation = 'r=696 (Double Hit)';
    }
    return result;
  }

  const targetPoints = { head: 3, shallow: 2, low: 1, none: 0 };
  let fighterAPts = targetPoints[initialHitTarget] || 0;
  let fighterBPts = targetPoints[afterblowTarget] || 0;

  if (isTakedown) fighterAPts += 2;
  if (isDisarm) fighterAPts += 2;
  if (isRingOutFleeing) fighterBPts += 1;

  if (afterblowTarget && afterblowTarget !== 'none' && initialHitTarget && initialHitTarget !== 'none') {
    const diff = fighterAPts - fighterBPts;
    if (diff > 0) {
      result.fighterAScore = diff;
      result.callSummary = `Fighter A: +${diff} Point(s) (Initial ${fighterAPts} pts - Afterblow ${fighterBPts} pts)`;
    } else if (diff < 0) {
      result.fighterBScore = Math.abs(diff);
      result.callSummary = `Fighter B: +${Math.abs(diff)} Point(s) (Afterblow ${fighterBPts} pts - Initial ${fighterAPts} pts)`;
    } else {
      result.callSummary = `Equal Hits (${fighterAPts} vs ${fighterBPts}): 0 Points (Clean Reset)`;
    }
    result.ruleCitation = 'r=696 (Net Score Afterblow)';
  } else if (initialHitTarget && initialHitTarget !== 'none') {
    result.fighterAScore = fighterAPts;
    result.callSummary = `Fighter A: +${fighterAPts} Point(s) (Clean Strike)`;
    result.ruleCitation = 'r=696 (Scoring Action)';
  } else if (isRingOutFleeing) {
    result.fighterBScore = 1;
    result.callSummary = 'Fighter B: +1 Point (Fleeing Ring-Out Penalty)';
    result.ruleCitation = 'r=696 (Ring Out Penalty)';
  } else {
    result.callSummary = 'No valid score recorded.';
    result.ruleCitation = 'r=696';
  }

  return result;
}
