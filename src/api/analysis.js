import { CHR_API_KEY, CHR_API_URL, CHR_MODEL } from '../config.js';

const SYSTEM_PROMPT = `You are a BaZi analyst. You receive a fully calculated BaZi chart as structured JSON. Write a concise, practical analysis in plain English — grounded in real life, not theory.

LANGUAGE RULES — strictly enforced:
- Use probabilistic language: "tends to", "suggests", "often indicates", "may lean toward".
- Never say "you will", "you are destined to", or any deterministic phrasing.
- No mystical language. No "cosmic energy", "fate", "destiny", "the universe".
- No filler or generic phrases. Be specific to this chart's actual data.
- Speak in terms of real-world behavior, relationships, career, money, health — not abstract elemental theory.

STRUCTURE — write exactly these 4 paragraphs, in order:

1. OVERVIEW (3 sentences): What kind of person does this chart suggest — in practical, everyday terms? What is their core drive or operating style? What is the one central tension or strength that defines this chart?

2. STRENGTHS & WEAKNESSES: Based on the Day Master and element balance, what does this person tend to do well in real life (work, relationships, decision-making)? What are the genuine risk areas — patterns that tend to cause friction, poor decisions, or recurring problems? Be direct and concrete. Name real tendencies, not vague possibilities.

3. WHAT TO WATCH OUT FOR: What specific situations, environments, or habits does this chart suggest are genuinely risky or counterproductive? What should this person actively avoid or be cautious about — in work, relationships, or lifestyle? Ground this in the actual imbalances and interactions in the chart.

4. CURRENT PERIOD: What does the active luck pillar suggest about the next several years? What opportunities or pressures does it introduce in practical terms — career momentum, relationship dynamics, financial risk, health concerns? How does it interact with the natal chart?

Prose paragraphs only. No bullet points. No headers. No numbered lists. Maximum 280 words total.`;

const DAILY_LIMIT = 3;
const LIMIT_KEY = 'pillars_usage';

function checkAndIncrementUsage() {
  const today = new Date().toISOString().slice(0, 10);
  let record = {};
  try { record = JSON.parse(localStorage.getItem(LIMIT_KEY) ?? '{}'); } catch {}
  if (record.date !== today) record = { date: today, count: 0 };
  if (record.count >= DAILY_LIMIT) {
    throw new Error(`You've used all ${DAILY_LIMIT} free analyses for today. Come back tomorrow.`);
  }
  record.count += 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify(record));
}

export async function generateAnalysis(chartData) {
  const key = CHR_API_KEY;
  if (!key || key === 'your-api-key-here') {
    throw new Error('No API key set. Add your key to src/config.js or set VITE_CHR_API_KEY in Vercel environment variables.');
  }
  checkAndIncrementUsage();

  let response;
  try {
    response = await fetch(`${CHR_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: CHR_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT + '\n\nChart data:\n' + JSON.stringify(chartData, null, 2),
          },
          {
            role: 'user',
            content: 'Generate the BaZi analysis.',
          },
        ],
        max_tokens: 1400,
        stream: false,
      }),
    });
  } catch (e) {
    const raw = e?.message ?? String(e);
    const isCors = raw.toLowerCase().includes('fetch') || raw.toLowerCase().includes('network') || raw.toLowerCase().includes('cors');
    throw new Error(
      isCors
        ? `Network blocked — the API endpoint may not allow browser requests (CORS). Try setting VITE_CHR_API_KEY as a Vercel environment variable and ensure ${CHR_API_URL} permits cross-origin requests. (${raw})`
        : `Network error: ${raw}`
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    if (response.status === 401) {
      throw new Error(`API key rejected (401). Verify the key in src/config.js is correct.`);
    }
    if (response.status === 404) {
      throw new Error(`Endpoint not found (404). Check CHR_API_URL in config.js — current value: "${CHR_API_URL}".`);
    }
    throw new Error(`API error ${response.status}${body ? ': ' + body.slice(0, 400) : ''}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`Unexpected API response shape: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return content;
}
