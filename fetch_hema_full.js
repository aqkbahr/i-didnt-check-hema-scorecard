import fs from 'fs';
import { execSync } from 'child_process';

const rules = [
  { id: 695, name: 'Code of Conduct', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=695' },
  { id: 696, name: 'General Sparring Tournament Rules', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=696' },
  { id: 697, name: 'Longsword Individual Rules', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=697' },
  { id: 698, name: 'Longsword Relay Rules', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=698' },
  { id: 699, name: 'Messer Rules', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=699' },
  { id: 700, name: 'Longsword Cutting Rules', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=700' },
  { id: 701, name: 'Aggregate Team Award', permalink: 'https://hemascorecard.com/infoRules.php?e=908&r=701' }
];

const results = {};

rules.forEach(item => {
  console.log(`=== Fetching ${item.name} (${item.id}) ===`);
  try {
    const cmd = `curl.exe -s -c cookies.txt -b cookies.txt "https://hemascorecard.com/infoRules.php?e=908&r=${item.id}"`;
    const html = execSync(cmd).toString();
    
    // Find documentation-div
    const startIdx = html.indexOf("<div class='documentation-div'>");
    let content = '';
    if (startIdx !== -1) {
      const endIdx = html.indexOf("</div id='a'>", startIdx);
      content = html.substring(startIdx, endIdx !== -1 ? endIdx : html.length);
    } else {
      content = html;
    }

    // Strip HTML tags for clean text
    const cleanText = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    results[item.id] = {
      id: item.id,
      name: item.name,
      permalink: item.permalink,
      text: cleanText,
      rawHtml: content
    };
    console.log(`Result ${item.id}: ${cleanText.length} characters parsed.`);
  } catch (err) {
    console.error(`Error ${item.id}:`, err);
  }
});

fs.writeFileSync('src/data/officialAGRulesFull.json', JSON.stringify(results, null, 2));
console.log('All 7 rules saved cleanly!');
