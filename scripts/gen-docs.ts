import { writeFileSync } from 'node:fs';
import { PLAN, PHASES } from '../src/data/plan';
import { RANKED, WEIGHTS } from '../src/data/priorities';
let md = `# 30-Day Study Plan\n\nAvailability assumed: **weekdays 2 h (120 min) · Saturday 4 h (240 min) · Sunday 5 h (300 min) · busy-day fallback 45 min**. Day 1 is a Monday (set your own start date in the app). Question references (Q001–Q011, D07, R03, V075–V077) point at the in-app question bank; every reference is checked by \`npm test\`.\n\nGenerated from \`src/data/plan.ts\`, the same data the app uses.\n\n`;
for (const p of PHASES) {
  md += `## Week ${p.week}: ${p.name} (Days ${p.days})\n\n${p.goal}\n\n`;
  for (const d of PLAN.filter((x) => x.week === p.week)) {
    md += `### Day ${d.day} (${d.kind}, ${d.minutes} min): ${d.focus}\n\n| Min | Section | Mode | Task | Questions / sets |\n|---:|---|---|---|---|\n`;
    for (const b of d.blocks) md += `| ${b.min} | ${b.section} | ${b.mode} | **${b.title}**${b.detail ? `: ${b.detail.replace(/\|/g, '/')}` : ''} | ${b.refs ? b.refs.join(', ') : b.testSection ? `In-app ${b.testSection === 'FULL' ? 'full mock' : b.testSection + ' sectional'}` : '–'} |\n`;
    md += `\n- **Accuracy target:** ${d.accuracy}\n- **Time target:** ${d.time}\n- **Revision / error log:** ${d.revision}\n- **Busy-day fallback (45 min):** ${d.fallback}${d.fallbackRefs ? ` (${d.fallbackRefs.join(', ')})` : ''}\n\n`;
  }
}
writeFileSync('STUDY_PLAN.md', md);
let pr = `| Rank | Section | Topic | Freq | Cons | Score pot. | Found. | 30-day | **Priority** | Class |\n|---:|---|---|---:|---:|---:|---:|---:|---:|---|\n`;
RANKED.forEach((t, i) => { const r = t.ratings; pr += `| ${i + 1} | ${t.section} | ${t.topic} | ${r.freq} | ${r.cons} | ${r.score} | ${r.found} | ${r.improve} | **${t.score}** | ${t.cls} |\n`; });
writeFileSync('dist/priority-table.md', pr + `\nWeights: ${JSON.stringify(WEIGHTS)}\n`);
