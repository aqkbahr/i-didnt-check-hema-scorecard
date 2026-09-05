import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data';

// Common English stop words to filter out natural language noise
const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does',
  'for', 'from', 'how', 'i', 'if', 'in', 'is', 'it', 'of', 'on', 'or', 'that',
  'the', 'this', 'to', 'was', 'what', 'when', 'where', 'which', 'who', 'will',
  'with', 'you', 'your', 'happens', 'happen', 'allowed', 'rules', 'rule'
]);

export function queryAGORules(query, selectedRulesetId = 'all', selectedTier = 'all') {
  if (!query || query.trim() === '') {
    return {
      hasMatch: false,
      requiresRulesetClarification: false,
      requiresTierClarification: false,
      clarificationPrompt: null,
      passages: []
    };
  }

  const qLower = query.toLowerCase().trim();
  
  // Extract key search terms by removing stop words
  const words = qLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (words.length === 0) {
    words.push(...qLower.split(/\s+/).filter(w => w.length > 2));
  }

  // 1. Check if Ruleset Clarification is required for multi-ruleset queries
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
        message: 'Your question touches on rules that differ between tournament divisions. Please select the relevant match ruleset:',
        options: [
          { id: '697', label: 'Individual Longsword (r=697)', rulesetId: '697', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=697' },
          { id: '698', label: 'Longsword Relay (r=698)', rulesetId: '698', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=698' },
          { id: '699', label: 'Messer (r=699)', rulesetId: '699', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=699' },
          { id: '700', label: 'Longsword Cutting (r=700)', rulesetId: '700', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=700' },
          { id: '701', label: 'Aggregate Team Award (r=701)', rulesetId: '701', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=701' },
          { id: '696', label: 'General Sparring (r=696)', rulesetId: '696', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=696' }
        ]
      },
      passages: []
    };
  }

  // 2. Target ruleset selection
  let targetRulesets = activeRulesetId
    ? HEMA_SCORECARD_EVENT_908.filter(r => r.id === activeRulesetId)
    : HEMA_SCORECARD_EVENT_908;

  // Cross-reference General Sparring (696) & Code of Conduct (695) if specific match ruleset selected
  if (activeRulesetId && activeRulesetId !== '696' && activeRulesetId !== '695') {
    const generalRules = HEMA_SCORECARD_EVENT_908.find(r => r.id === '696');
    const conductRules = HEMA_SCORECARD_EVENT_908.find(r => r.id === '695');
    if (generalRules && !targetRulesets.some(r => r.id === '696')) targetRulesets.push(generalRules);
    if (conductRules && !targetRulesets.some(r => r.id === '695')) targetRulesets.push(conductRules);
  }

  const matchingPassages = [];

  targetRulesets.forEach(ruleset => {
    // Split full text into paragraphs
    const paragraphs = ruleset.rawText.split(/\n\s*\n/).filter(p => p.trim().length > 15);

    paragraphs.forEach(para => {
      const pLower = para.toLowerCase();
      let matchScore = 0;

      // Check keyword occurrences
      words.forEach(word => {
        if (pLower.includes(word)) {
          matchScore += 10;
        }
      });

      // Bonus if primary selected ruleset matches
      if (ruleset.id === activeRulesetId) {
        matchScore += 5;
      }

      if (matchScore >= 10) {
        matchingPassages.push({
          rulesetId: ruleset.id,
          rulesetName: ruleset.name,
          permalink: ruleset.permalink,
          score: matchScore,
          passageText: para.trim(),
          highlightedText: highlightKeywords(para.trim(), words)
        });
      }
    });
  });

  matchingPassages.sort((a, b) => b.score - a.score);

  return {
    hasMatch: matchingPassages.length > 0,
    requiresRulesetClarification: false,
    requiresTierClarification: false,
    passages: matchingPassages
  };
}

function highlightKeywords(text, words) {
  if (!words || words.length === 0) return text;
  let result = text;
  
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  sortedWords.forEach(w => {
    if (w.length < 3) return;
    const regex = new RegExp(`(${w})`, 'gi');
    result = result.replace(regex, '___MARK_START___$1___MARK_END___');
  });

  result = result
    .replace(/___MARK_START___/g, '<mark class="highlight-rule">')
    .replace(/___MARK_END___/g, '</mark>');

  return result;
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
