import { CHR_API_KEY, CHR_API_URL, CHR_MODEL } from '../config.js';

const SYSTEM_PROMPT = `You are a BaZi analyst. You receive a fully calculated BaZi chart as structured JSON. Write a clear, direct analysis in English.

LANGUAGE RULES — strictly enforced:
- Use probabilistic language throughout: "tends to", "suggests", "often indicates", "may lean toward", "the pattern is consistent with".
- Never use "you will", "you are destined", "this means you", or any deterministic phrasing.
- Treat BaZi as a structured model of tendencies and timing — not prophecy, not character diagnosis.
- No mystical language. No "cosmic energy", "fate", "destiny manifest", "the universe".
- No filler: omit generic phrases like "exciting times ahead", "be careful of", "great success awaits".
- Be specific to the chart data provided. Do not pad with generalities that would apply to anyone.

STRUCTURE:
1. Opening paragraph (3 sentences max): plain-English summary of the chart's dominant pattern.
2. Day Master paragraph: what the Day Master element and polarity suggest about the person's baseline disposition and processing style.
3. Element balance paragraph: which elements are over- or under-represented, and what that means for the chart's overall dynamic.
4. Suggested Balancing Element paragraph: identify the primary balancing element, explain what role it plays relative to the Day Master, and what its presence or absence in the chart implies.
5. Current luck pillar paragraph: describe the luck pillar active at the current age and what shift in elemental influence it introduces.
6. Special stars paragraph (only if stars are present): describe which stars are present, in which pillars, and what tendencies they are associated with — factually, without inflation.
7. Branch and stem interactions paragraph (only if interactions are present): describe significant interactions, what elements they amplify or suppress, and the pillars involved.

Prose paragraphs only. No bullet points. No headers. No numbered lists.`;

export async function generateAnalysis(chartData) {
  const key = CHR_API_KEY;
  if (!key || key === 'your-api-key-here') {
    throw new Error('No API key set. Add your key to src/config.js or set VITE_CHR_API_KEY in Vercel environment variables.');
  }

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
