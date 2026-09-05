import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('src/data/officialAGRulesFull.json', 'utf8'));

const structuredRulesets = [
  {
    id: '695',
    slug: 'code-of-conduct',
    name: 'Code of Conduct',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=695',
    category: 'Conduct & Safety',
    hasTiers: false,
    summary: 'AG Open safety, inclusivity, anti-harassment policy, reporting procedures, and event venue rules.'
  },
  {
    id: '696',
    slug: 'general-sparring',
    name: 'General Sparring Tournament Rules',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=696',
    category: 'General Sparring',
    hasTiers: false,
    summary: 'Common rules for all sparring events: equipment requirements, pulled attacks, match conduct, penalties, and ring-out rules.'
  },
  {
    id: '697',
    slug: 'individual-longsword',
    name: 'Individual Longsword Rules',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=697',
    category: 'Sparring Division',
    hasTiers: true,
    tiers: ['Tier A (Open)', 'Tier B (Intermediate)', 'Women\'s / Gender Minorities'],
    summary: 'Rules specific to Longsword: Max blade 101 cm, max flex 18 kg at cross, KdF cutting mechanics, quality scoring.'
  },
  {
    id: '698',
    slug: 'longsword-relay',
    name: 'Longsword Relay Rules',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=698',
    category: 'Team Sparring',
    hasTiers: true,
    tiers: ['Tier A (School/Club Teams)', 'Tier B (Random Pickup / Intermediate Teams)'],
    summary: 'Team Longsword Relay: 3 fencers per team (ordered weakest to strongest). Tier A counts for Aggregate Award; Tier B pickup teams do not.'
  },
  {
    id: '699',
    slug: 'messer',
    name: 'Messer Rules',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=699',
    category: 'Sparring Division',
    hasTiers: false,
    summary: 'Single sword / Messer rules: Buckling flex max 19.5 kg, pommels explicitly non-scoring, close-quarters fencing.'
  },
  {
    id: '700',
    slug: 'longsword-cutting',
    name: 'Longsword Cutting Rules',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=700',
    category: 'Cutting',
    hasTiers: true,
    tiers: ['Tier A (Dynamic Cutting Patterns)', 'Tier B (Static Cutting Patterns)'],
    summary: 'Steel sharp longsword cutting: Static paper/mat patterns (Tier B) vs Dynamic moving target patterns (Tier A).'
  },
  {
    id: '701',
    slug: 'aggregate-team-award',
    name: 'Aggregate Team Award',
    permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=701',
    category: 'Team Scoring',
    hasTiers: false,
    summary: 'Overall school team award: Top 4 finalist = 9 pts, Top 1/3 = 3 pts, Top 1/2 = 1 pt. Individual best result counted once.'
  }
];

const processedData = structuredRulesets.map(item => {
  const raw = rawData[item.id] || {};
  return {
    ...item,
    rawText: raw.text || '',
    rawHtml: raw.html || ''
  };
});

const fileContent = `// Official Atlantic Gathering (AG Open 2026) Event 908 Rules Dataset from HEMAScorecard
export const HEMA_SCORECARD_EVENT_908 = ${JSON.stringify(processedData, null, 2)};
`;

fs.writeFileSync('src/data/hemaScorecard2026Data.js', fileContent);
console.log('Successfully generated src/data/hemaScorecard2026Data.js!');
