import { toDayNumber } from './dateUtils.js';
import { STEMS, BRANCHES } from './constants.js';

// Jan 7, 2000 = 甲子 = cycle index 0 (same anchor as calculate.js)
const ANCHOR = toDayNumber(2000, 1, 7);

const READINGS = {
  'Wood-Wood':   'Wood upon Wood: vitality compounds. Structure reinforces itself today — plan before committing.',
  'Wood-Fire':   'Wood feeds Fire: creative output peaks. Channel the momentum before it consumes itself.',
  'Wood-Earth':  'Wood over Earth: roots meet resistance. Patience with structure unlocks the day.',
  'Wood-Metal':  'Wood meets Metal: precision tests growth. One well-aimed decision outweighs ten scattered ones.',
  'Wood-Water':  'Wood drinks Water: resources and ideas align. Morning hours carry the clearest signal.',
  'Fire-Wood':   'Fire above Wood: ambition has fuel. Commit early and protect the flame through the afternoon.',
  'Fire-Fire':   'Fire over Fire: intensity peaks — watch for overextension. Consolidate before the Metal hour.',
  'Fire-Earth':  'Fire warms Earth: authority flows naturally. Decisions carry weight; use them sparingly.',
  'Fire-Metal':  'Fire refines Metal: transformative pressure clarifies the form. Cut what no longer fits.',
  'Fire-Water':  'Fire meets Water: opposing forces generate precision. Navigate rather than force.',
  'Earth-Wood':  'Earth contains Wood: creativity needs structure today. Build the container first.',
  'Earth-Fire':  'Earth over Fire: warmth sustains stability. Tend long-term work over quick returns.',
  'Earth-Earth': 'Earth upon Earth: solid, persistent, slow to shift. Ideal for consolidation, not speed.',
  'Earth-Metal': 'Earth produces Metal: resources become tools. Extract value from what you already have.',
  'Earth-Water': 'Earth controls Water: direction over drift. Commit to a current and follow it through.',
  'Metal-Wood':  'Metal over Wood: precision meets growth. Edit rather than expand — the cut clarifies.',
  'Metal-Fire':  'Metal meets Fire: pressure builds clarity. What survives refinement is worth keeping.',
  'Metal-Earth': 'Metal draws from Earth: structured effort yields. Detail work rewards today.',
  'Metal-Metal': 'Metal upon Metal: sharp, clear, uncompromising. Useful for boundaries, hard on relationships.',
  'Metal-Water': 'Metal produces Water: clarity flows into strategy. The day rewards thoughtful movement.',
  'Water-Wood':  'Water feeds Wood: generative energy. Decisions taken now take root through the week.',
  'Water-Fire':  'Water over Fire: opposition creates productive tension. Navigate the contrast deliberately.',
  'Water-Earth': 'Water meets Earth: channels and constraints shape the flow. Work within limits to find the path.',
  'Water-Metal': 'Water from Metal: resources available to those who wait. Strategic patience earns more than urgency.',
  'Water-Water': 'Water upon Water: depth and stillness. Observe more than you act — intelligence accumulates.',
};

export function getTodayPillar() {
  const now = new Date();
  const cycleIdx = (((toDayNumber(now.getFullYear(), now.getMonth() + 1, now.getDate()) - ANCHOR) % 60) + 60) % 60;
  const stem = STEMS[cycleIdx % 10];
  const branch = BRANCHES[cycleIdx % 12];
  return {
    stem,
    branch,
    reading: READINGS[`${stem.element}-${branch.element}`] ?? 'A day of balanced qi. Each element finds its place.',
  };
}
