import { CHR_API_KEY, CHR_API_URL, CHR_MODEL } from '../config.js';

async function call(systemPrompt, chartSummary, maxTokens = 600) {
  const key = CHR_API_KEY;
  if (!key || key === 'your-api-key-here') throw new Error('No API key configured.');

  const resp = await fetch(`${CHR_API_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: CHR_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Chart data:\n' + JSON.stringify(chartSummary) },
      ],
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`API error ${resp.status}${body ? ': ' + body.slice(0, 200) : ''}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Unexpected API response.');
  return content.trim();
}

function chartSummary(chart) {
  const { dayMaster, elementBalance, luckPillars, currentYear, birthDate } = chart;
  const age = currentYear - birthDate.year;
  const currentPillar = luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);
  return {
    dayMaster: { element: dayMaster.stem.element, polarity: dayMaster.stem.polarity, pinyin: dayMaster.stem.pinyin },
    elementBalance: { totals: elementBalance.totals, strong: elementBalance.strong, balancingElement: elementBalance.balancingElement },
    currentLuckPillar: currentPillar ? { startAge: currentPillar.startAge, endAge: currentPillar.endAge, stemIdx: currentPillar.stemIdx, branchIdx: currentPillar.branchIdx } : null,
    age,
  };
}

const BASE_RULES = `RULES — strictly enforced:
- Be specific to this chart's actual data. No generic statements.
- Use probabilistic language: "tends to", "suggests", "often indicates". Never deterministic.
- No mystical language. No "cosmic energy", "fate", "destiny", "the universe".
- Real-world terms only: behavior, career, relationships, decisions, energy, patterns.
- No filler. Every sentence earns its place.
- Output only the requested sentences. No headers, labels, or line breaks between sentences.`;

export async function generateTodayPillarReading(chart, todayPillar) {
  const summary = {
    ...chartSummary(chart),
    today: {
      stem: todayPillar.stem.english,
      stemElement: todayPillar.stem.element,
      branch: todayPillar.branch.english,
      branchElement: todayPillar.branch.element,
    },
  };

  return call(
    `You are a BaZi analyst. Given a person's chart and today's day pillar (stem + branch), write exactly 2 sentences explaining how today's elemental energy interacts with this person's Day Master and chart balance — what it means for them today specifically, in practical terms.
${BASE_RULES}`,
    summary,
    300,
  );
}

export async function generatePillarDetail(chart, pillar, pillarLabel) {
  const summary = {
    ...chartSummary(chart),
    targetPillar: {
      label: pillarLabel,
      stem: pillar.stem.english,
      stemElement: pillar.stem.element,
      stemPolarity: pillar.stem.polarity,
      branch: pillar.branch.english,
      branchElement: pillar.branch.element,
      tenGod: pillar.tenGod?.english ?? null,
    },
  };

  return call(
    `You are a BaZi analyst. Given a person's chart and one specific natal pillar (Year/Month/Day/Hour), write exactly 3 sentences: what this pillar's stem-branch combination reveals about the person, how it relates to their Day Master, and what area of life it most influences (Year=ancestry/foundation, Month=career/society, Day=self/relationships, Hour=inner world/legacy).
${BASE_RULES}`,
    summary,
    400,
  );
}

export async function generateElementBalanceReading(chart) {
  const { elementBalance, dayMaster, pillars } = chart;
  const summary = {
    dayMaster: { element: dayMaster.stem.element, polarity: dayMaster.stem.polarity },
    elementBalance: {
      totals: elementBalance.totals,
      total: elementBalance.total,
      strong: elementBalance.strong,
      balancingElement: elementBalance.balancingElement,
      dominantElements: Object.entries(elementBalance.totals).sort(([,a],[,b])=>b-a).slice(0,2).map(([k])=>k),
    },
    pillars: pillars.map(p => ({ stem: p.stem.element, branch: p.branch.element })),
  };

  return call(
    `You are a BaZi analyst. Given a person's element balance, write exactly 3 sentences: what their dominant and missing elements reveal about their natural tendencies and blind spots in real life, what the strong/weak Day Master means for how they operate, and what leaning toward the balancing element might look like as a practical behavior or environment choice.
${BASE_RULES}`,
    summary,
    450,
  );
}

export async function generateInteractionsReading(chart) {
  const { branchInteractions = [], stemCombinations = [], dayMaster, elementBalance } = chart;
  const summary = {
    dayMaster: { element: dayMaster.stem.element, polarity: dayMaster.stem.polarity },
    elementBalance: { strong: elementBalance.strong },
    stemCombinations: stemCombinations.map(s => ({ name: s.name, typeEnglish: s.typeEnglish, pillars: s.pillars, element: s.element })),
    branchInteractions: branchInteractions.map(b => ({ name: b.name, typeEnglish: b.typeEnglish, pillars: b.pillars, effect: b.effect })),
  };

  return call(
    `You are a BaZi analyst. Given a person's natal chart interactions (stem combinations and branch interactions), write exactly 3 sentences: identify the most significant interaction and what it does to the chart's elemental balance, how the harmonies and tensions in this chart shape the person's relationships or internal conflicts, and what the overall pattern of interactions suggests about recurring life themes.
${BASE_RULES}`,
    summary,
    450,
  );
}

export async function generatePersonalityReading(chart) {
  return call(
    `You are a BaZi analyst. Write a personality reading in exactly 4 sentences: the person's core operating style and what drives them (based on Day Master element and polarity), their natural strengths that show up consistently across contexts, their characteristic blind spot or tension that recurs in relationships and decisions, and the underlying need or value that motivates most of their behavior.
${BASE_RULES}`,
    chartSummary(chart),
    550,
  );
}

export async function generateCareerReading(chart) {
  const { dayMaster, elementBalance, pillars, luckPillars, currentYear, birthDate } = chart;
  const age = currentYear - birthDate.year;
  const monthPillar = pillars?.[1];
  const currentPillar = luckPillars?.pillars?.find(p => age >= p.startAge && age < p.endAge);

  const summary = {
    dayMaster: { element: dayMaster.stem.element, polarity: dayMaster.stem.polarity },
    elementBalance: { totals: elementBalance.totals, strong: elementBalance.strong, balancingElement: elementBalance.balancingElement },
    monthPillar: monthPillar ? { stem: monthPillar.stem.element, branch: monthPillar.branch.element, tenGod: monthPillar.tenGod?.english } : null,
    currentLuckPillar: currentPillar ? { startAge: currentPillar.startAge, endAge: currentPillar.endAge } : null,
    age,
  };

  return call(
    `You are a BaZi analyst. Write a career reading in exactly 4 sentences: the type of work environments and roles where this person tends to perform best (based on Day Master and Month Pillar), what career challenges or patterns tend to repeat for this chart type, what the current luck pillar is shifting in terms of career energy and opportunity, and one concrete strategic direction this chart suggests for the next few years.
${BASE_RULES}`,
    summary,
    550,
  );
}

export async function generateRelationshipsReading(chart) {
  const { dayMaster, elementBalance, pillars } = chart;
  const dayPillar = pillars?.[2];
  const summary = {
    dayMaster: { element: dayMaster.stem.element, polarity: dayMaster.stem.polarity },
    elementBalance: { totals: elementBalance.totals, strong: elementBalance.strong },
    dayPillar: dayPillar ? { stem: dayPillar.stem.element, branch: dayPillar.branch.element } : null,
    stemCombinations: (chart.stemCombinations ?? []).map(s => ({ typeEnglish: s.typeEnglish, pillars: s.pillars })),
    branchInteractions: (chart.branchInteractions ?? []).filter(b => b.pillars?.includes('Day')).map(b => ({ typeEnglish: b.typeEnglish, effect: b.effect })),
  };

  return call(
    `You are a BaZi analyst. Write a relationships reading in exactly 4 sentences: how this person typically shows up in close relationships (attachment style, emotional availability), what they need from a partner or close collaborator to function well, what relational pattern tends to create friction or repeat as a lesson, and what this chart suggests about the type of relationship dynamic that tends to bring out their best.
${BASE_RULES}`,
    summary,
    550,
  );
}

export async function generateLuckPillarReading(chart, luckPillar, STEMS, BRANCHES) {
  const age = chart.currentYear - chart.birthDate.year;
  const stem = STEMS[luckPillar.stemIdx];
  const branch = BRANCHES[luckPillar.branchIdx];
  const isCurrent = age >= luckPillar.startAge && age < luckPillar.endAge;

  const summary = {
    ...chartSummary(chart),
    luckPillar: {
      stem: stem.english,
      stemElement: stem.element,
      stemPolarity: stem.polarity,
      branch: branch.english,
      branchElement: branch.element,
      startAge: luckPillar.startAge,
      endAge: luckPillar.endAge,
      isCurrent,
    },
  };

  return call(
    `You are a BaZi analyst. Given a person's natal chart and one of their 10-year luck pillars, write exactly 3 sentences: what elemental shift this luck pillar introduces relative to the natal chart, what domain of life (career, relationships, health, finances, self-development) this pillar tends to activate or test, and what a person with this Day Master typically experiences during this type of pillar — opportunities they should watch for or patterns to navigate.
${BASE_RULES}`,
    summary,
    450,
  );
}
