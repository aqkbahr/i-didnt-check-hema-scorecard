import { HEMA_SCORECARD_EVENT_908 } from '../data/hemaScorecard2026Data.js';

/**
 * Domain-specific noise words that should not trigger high relevance matches on their own.
 */
const DOMAIN_STOPWORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does',
  'for', 'from', 'how', 'i', 'if', 'in', 'is', 'it', 'of', 'on', 'or', 'that',
  'the', 'this', 'to', 'was', 'what', 'when', 'where', 'which', 'who', 'will',
  'with', 'you', 'your', 'happens', 'happen', 'allowed', 'rules', 'rule', 'ruleset',
  'sword', 'swords', 'hit', 'hits', 'hitting', 'struck', 'strike', 'strikes', 'striking',
  'point', 'points', 'fighter', 'fighters', 'fencer', 'fencers', 'match', 'matches',
  'tournament', 'tournaments', 'action', 'actions', 'use', 'using', 'used', 'get',
  'gets', 'result', 'results', 'competition', 'competitor', 'competitors', 'occur',
  'occurs', 'permitted', 'valid', 'invalid', 'example', 'examples', 'did', 'done',
  'should', 'would', 'could', 'after', 'before', 'during', 'someone', 'somebody',
  'other', 'another', 'each', 'they', 'them', 'their'
]);

/**
 * Intent Patterns & Synonym Mappings for HEMA Queries
 */
const INTENT_DEFINITIONS = [
  {
    id: 'pommel_strike',
    name: 'Pommel & Hilt Strikes',
    matchReason: 'Matched: Pommel Strikes & Hilt Contact Rules',
    patterns: [
      /\bpommel\b/i, /\bhilt strike\b/i, /\bpommeling\b/i,
      /\bpommel strike\b/i, /\bpommel to face\b/i, /\bhit mask with pommel\b/i
    ],
    passageKeywords: ['pommel', 'pommels', 'pommel strike', 'pommel strikes', 'pommel strikes are only valid']
  },
  {
    id: 'turn_back_spine',
    name: 'Exposing Back / Spine Safety',
    matchReason: 'Matched: Exposing Spine & Back of Head Safety Rules',
    patterns: [
      /turn.*back/i, /back.*turned/i, /turning.*back/i, /\bspine\b/i,
      /\bback of the head\b/i, /\bback of head\b/i, /expose.*back/i,
      /exposed.*back/i, /unsafe target/i, /turning away/i
    ],
    passageKeywords: ['spine', 'back of the head', 'exposing', 'turned', 'turning']
  },
  {
    id: 'afterblow',
    name: 'Afterblow & Timing Rules',
    matchReason: 'Matched: Afterblow Definition & Scoring Deductions',
    patterns: [
      /\bafterblow\b/i, /\bafter blow\b/i, /\bafter-blow\b/i, /\brevenge hit\b/i,
      /hit.*after/i, /they hit.*after/i, /hit arm after/i, /after stroke/i
    ],
    passageKeywords: ['afterblow', 'after blow', 'deduct', 'tempo']
  },
  {
    id: 'double_hit',
    name: 'Double Hits & Simultaneous Strikes',
    matchReason: 'Matched: Double Hits & Simultaneous Action Rules',
    patterns: [
      /\bdouble\b/i, /\bdouble hit\b/i, /\bdouble hits\b/i, /\bboth hit\b/i,
      /\bsimultaneous\b/i, /\bboth struck\b/i, /both hit each other/i, /hit each other/i
    ],
    passageKeywords: ['double hit', 'double hits', 'simultaneous', 'both fighters land']
  },
  {
    id: 'ring_out',
    name: 'Ring Outs & Boundaries',
    matchReason: 'Matched: Ring Outs & Boundary Violation Rules',
    patterns: [
      /\bring out\b/i, /\bring-out\b/i, /\bring outs\b/i, /\bstep out\b/i,
      /\bstepped out\b/i, /\bout of bounds\b/i, /\bboundary\b/i, /\bfleeing\b/i,
      /step out after/i, /ring out penalty/i
    ],
    passageKeywords: ['ring out', 'ring outs', 'out of bounds', 'boundary', 'feet']
  },
  {
    id: 'equipment_target',
    name: 'Equipment & Target Areas',
    matchReason: 'Matched: Target Area Definitions & Mandatory Equipment',
    patterns: [
      /\bgloves\b/i, /\bglove\b/i, /\bgear\b/i, /\bequipment\b/i, /\blacrosse\b/i,
      /\bspes\b/i, /\bprogauntlet\b/i, /gloves count/i, /hand target/i, /\bgorget\b/i,
      /\bjacket\b/i, /\bmask\b/i, /\bknee\b/i, /\belbow\b/i, /\btarget area\b/i
    ],
    passageKeywords: ['equipment', 'gloves', 'target area', 'hand strikes', 'lacrosse']
  },
  {
    id: 'grappling_takedown',
    name: 'Takedowns & Grappling',
    matchReason: 'Matched: Takedowns, Wrestling & Grappling Rules',
    patterns: [
      /\bthrow\b/i, /\bthrows\b/i, /\btakedown\b/i, /\btakedowns\b/i, /\bwrestle\b/i,
      /\bwrestling\b/i, /\bgrapple\b/i, /\bgrappling\b/i, /\bclinch\b/i, /\bdisarm\b/i
    ],
    passageKeywords: ['takedown', 'takedowns', 'throws', 'wrestling', 'grapple', 'disarm']
  }
];

/**
 * Parses raw rules text into structured passages with section headings.
 */

export function parseRulebookPassages(ruleset) {
  const text = ruleset.rawText || '';
  const lines = text.split(/\r?\n/);
  const rawParagraphs = [];

  let currentHeading = ruleset.name;
  let currentParagraph = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (currentParagraph.length > 0) {
        const fullPara = currentParagraph.join(' ').trim();
        if (fullPara.length > 15) {
          rawParagraphs.push({
            heading: currentHeading,
            text: fullPara
          });
        }
        currentParagraph = [];
      }
      continue;
    }

    // Detect section heading heuristics
    const isShortLine = line.length < 40;
    const isTitleLike = /^[A-Z0-9\s\-:–\(\)]{3,45}$/.test(line) ||
      ['Forbidden Actions', 'Ring Outs', 'Match Conduct', 'Scoring Actions', 'Equipment',
       'Pommel Strikes', 'Targets', 'Double Hits', 'Afterblow Definition', 'Pulling of Attacks',
       'Illegal Actions', 'Wrestling and Takedowns', 'Team Composition', 'Match End',
       'Self Calls', 'Penalties', 'Quality Standards', 'Cuts', 'Thrusts', 'Slices',
       'Target Area Definitions', 'Blade Grabs & Disarms', 'Target Substitution',
       'Static (Tier B) Cutting Patterns', 'Dynamic (Tier-A) Cutting Patterns'].some(h => line.toLowerCase().includes(h.toLowerCase()));

    if (isTitleLike && isShortLine && currentParagraph.length === 0) {
      currentHeading = line;
    } else {
      currentParagraph.push(line);
    }
  }

  if (currentParagraph.length > 0) {
    const fullPara = currentParagraph.join(' ').trim();
    if (fullPara.length > 15) {
      rawParagraphs.push({
        heading: currentHeading,
        text: fullPara
      });
    }
  }

  // Group short paragraphs under the same heading to create larger contextual blocks (~350-750 characters)
  const passages = [];
  let bufferText = '';
  let bufferHeading = '';

  for (let i = 0; i < rawParagraphs.length; i++) {
    const item = rawParagraphs[i];

    if (!bufferHeading) {
      bufferHeading = item.heading;
      bufferText = item.text;
    } else if (item.heading === bufferHeading && (bufferText.length < 350 || item.text.length < 150)) {
      bufferText += '\n\n' + item.text;
    } else {
      passages.push({
        id: `${ruleset.id}-${passages.length}`,
        rulesetId: ruleset.id,
        rulesetName: ruleset.name,
        permalink: ruleset.permalink,
        heading: bufferHeading,
        text: bufferText
      });
      bufferHeading = item.heading;
      bufferText = item.text;
    }
  }

  if (bufferText) {
    passages.push({
      id: `${ruleset.id}-${passages.length}`,
      rulesetId: ruleset.id,
      rulesetName: ruleset.name,
      permalink: ruleset.permalink,
      heading: bufferHeading,
      text: bufferText
    });
  }

  return passages;
}

/**
 * Intelligent Context-Aware Query Engine
 */
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

  // Extract non-stopword domain terms
  const domainTerms = qLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !DOMAIN_STOPWORDS.has(w));

  // 1. Detect Intent
  const matchedIntents = INTENT_DEFINITIONS.filter(intent =>
    intent.patterns.some(pattern => pattern.test(query))
  );

  // 2. Check if Ruleset Clarification is required for multi-ruleset queries
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

  // 3. Gather rulesets to search
  let targetRulesets = activeRulesetId
    ? HEMA_SCORECARD_EVENT_908.filter(r => r.id === activeRulesetId)
    : HEMA_SCORECARD_EVENT_908;

  // Include General Sparring (696) as secondary context if specific ruleset is selected
  if (activeRulesetId && activeRulesetId !== '696' && activeRulesetId !== '695') {
    const generalRules = HEMA_SCORECARD_EVENT_908.find(r => r.id === '696');
    if (generalRules && !targetRulesets.some(r => r.id === '696')) {
      targetRulesets.push(generalRules);
    }
  }

  // Parse all candidate passages
  const allPassages = [];
  targetRulesets.forEach(rs => {
    const parsed = parseRulebookPassages(rs);
    allPassages.push(...parsed);
  });

  // 4. Multi-factor Passage Scoring Engine
  const scoredPassages = [];

  allPassages.forEach(pass => {
    const pLower = pass.text.toLowerCase();
    const hLower = pass.heading.toLowerCase();
    let score = 0;
    let primaryReason = pass.heading;

    // A. Intent Scoring (+60 to +100)
    matchedIntents.forEach(intent => {
      let isIntentMatched = false;

      // Check if passage contains intent keywords
      intent.passageKeywords.forEach(kw => {
        if (pLower.includes(kw.toLowerCase()) || hLower.includes(kw.toLowerCase())) {
          isIntentMatched = true;
        }
      });

      if (isIntentMatched) {
        score += 70;
        primaryReason = intent.matchReason;
      }
    });

    // B. Exact Phrase Match in passage text or heading (+40 to +60)
    if (domainTerms.length >= 2) {
      const phrase = domainTerms.join(' ');
      if (pLower.includes(phrase)) score += 60;
      if (hLower.includes(phrase)) score += 40;
    }

    // C. Non-stopword Domain Term Matches (+15 per term)
    let matchedTermsCount = 0;
    domainTerms.forEach(term => {
      if (pLower.includes(term)) {
        score += 15;
        matchedTermsCount++;
      }
      if (hLower.includes(term)) {
        score += 25;
        matchedTermsCount++;
      }
    });

    // D. Proximity / Co-occurrence Boost (+20 if 2+ domain terms present)
    if (matchedTermsCount >= 2) {
      score += 25;
    }

    // E. Selected Ruleset Boost (+10 for primary selected ruleset)
    if (activeRulesetId && pass.rulesetId === activeRulesetId) {
      score += 10;
    }

    // F. Minimum Relevance Threshold (Minimum Score = 25)
    if (score >= 25) {
      scoredPassages.push({
        ...pass,
        passageText: pass.text,
        score,
        matchReason: primaryReason,
        highlightedText: highlightKeywords(pass.text, domainTerms, matchedIntents)
      });
    }
  });

  // Sort by score descending
  scoredPassages.sort((a, b) => b.score - a.score);

  // Return top 3-5 results above threshold
  const topPassages = scoredPassages.slice(0, 5);

  return {
    hasMatch: topPassages.length > 0,
    requiresRulesetClarification: false,
    requiresTierClarification: false,
    passages: topPassages
  };
}

/**
 * Highlights domain terms and intent keywords with glowing mark tags
 */

/**
 * Google AI-style passage & keyword highlighter.
 * Identifies the single most relevant sentence/passage within the full paragraph
 * and wraps it in <mark class="ai-highlight-passage"> while preserving full paragraph context.
 */
export function highlightKeywords(text, domainTerms = [], matchedIntents = []) {
  if (!text) return '';

  const sentenceRegex = /([^.!?]+[.!?]+|\s*[^.!?]+$)/g;
  const sentences = text.match(sentenceRegex) || [text];

  const termsToHighlight = new Set([...domainTerms]);
  matchedIntents.forEach(intent => {
    intent.passageKeywords.forEach(kw => termsToHighlight.add(kw.toLowerCase()));
  });

  const sortedTerms = Array.from(termsToHighlight)
    .filter(t => t.length >= 3 && !DOMAIN_STOPWORDS.has(t))
    .sort((a, b) => b.length - a.length);

  // Score each sentence within the paragraph to find the most relevant passage
  let bestSentenceIdx = -1;
  let bestSentenceScore = 0;

  sentences.forEach((sentence, idx) => {
    const sLower = sentence.toLowerCase();
    let sScore = 0;

    sortedTerms.forEach(term => {
      if (sLower.includes(term)) sScore += 10;
    });

    matchedIntents.forEach(intent => {
      intent.passageKeywords.forEach(kw => {
        if (sLower.includes(kw.toLowerCase())) sScore += 25;
      });
    });

    if (sScore > bestSentenceScore) {
      bestSentenceScore = sScore;
      bestSentenceIdx = idx;
    }
  });

  // Reconstruct paragraph, marking the top passage and keyword matches
  const processedSentences = sentences.map((sentence, idx) => {
    let sentenceText = sentence;

    // Replace matching terms with temporary tokens
    sortedTerms.forEach(w => {
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      sentenceText = sentenceText.replace(regex, '___MARK_START___$1___MARK_END___');
    });

    // Wrap the single most relevant sentence if score > 0
    if (idx === bestSentenceIdx && bestSentenceScore > 0) {
      return `___AI_PASSAGE_START___${sentenceText}___AI_PASSAGE_END___`;
    }
    return sentenceText;
  });

  let result = processedSentences.join('');

  result = result
    .replace(/___AI_PASSAGE_START___/g, '<mark class="ai-highlight-passage">')
    .replace(/___AI_PASSAGE_END___/g, '</mark>')
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
