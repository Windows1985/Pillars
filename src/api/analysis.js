import { CHR_API_KEY, CHR_API_URL, CHR_MODEL } from '../config.js';

const SYSTEM_PROMPT = `You are a BaZi analyst. You receive a fully calculated BaZi chart as structured JSON. Write a three-sentence overview grounded in real life, not theory.

RULES — strictly enforced:
- Write EXACTLY three sentences. Not two, not four. Three.
- Each sentence must be specific to this chart's actual data — Day Master element, polarity, element balance, and active luck pillar.
- Use probabilistic language: "tends to", "suggests", "often indicates". Never "you will" or deterministic phrasing.
- No mystical language. No "cosmic energy", "fate", "destiny", "the universe".
- No filler. Every word must earn its place.
- Speak in terms of real-world behavior, relationships, career, money — not abstract elemental theory.

SENTENCE STRUCTURE:
1. What kind of person does this chart suggest — their core operating style and what drives them day-to-day?
2. What is the defining tension or imbalance in this chart, and how does it show up in real life?
3. What does the active luck pillar add or shift for this person right now?

Output only the three sentences. No labels, no headers, no line breaks between sentences.`;

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
