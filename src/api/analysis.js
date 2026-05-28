import { CHR_API_KEY, CHR_API_URL, CHR_MODEL } from '../config.js';

const SYSTEM_PROMPT = `You are a BaZi (Four Pillars of Destiny) analyst. You receive a structured JSON object containing a fully calculated BaZi chart. Your job is to write a clear, direct analysis in English.

Rules:
- Open with a 3-sentence plain-English summary paragraph.
- Then write separate paragraphs covering: Day Master character, element balance and what's missing, Useful God and why, current luck pillar interpretation, key special stars and their practical meaning, significant branch interactions and what they activate or suppress.
- Write as a personality and timing framework — not fortune telling.
- No mystical language. No vague generalities. Treat this like a structured personality and timing model.
- Use the romanisation (pinyin) in brackets after Chinese terms on first mention. E.g. "丁 (Dīng)".
- Prose paragraphs only — no bullet points, no headers beyond the opening summary.`;

export async function generateAnalysis(chartData) {
  const response = await fetch(`${CHR_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHR_API_KEY}`,
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
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}
