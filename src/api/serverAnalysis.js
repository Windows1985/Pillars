import { supabase, SUPABASE_FN_URL, SUPABASE_ANON_KEY } from '../lib/supabase.js';

export async function saveChart(chartData, name = 'My Chart') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('charts')
    .insert({ user_id: session.user.id, chart_data: chartData, name })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function generateTeaser(chartId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const resp = await fetch(`${SUPABASE_FN_URL}/generate-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ chart_id: chartId, type: 'teaser' }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error ?? resp.statusText);
  return data.content;
}

export async function generateNatal(chartId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const resp = await fetch(`${SUPABASE_FN_URL}/generate-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ chart_id: chartId, type: 'natal' }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error ?? `${resp.status} ${resp.statusText}`);
  return data.content;
}

export async function loadUserCharts() {
  const { data, error } = await supabase
    .from('charts')
    .select('id, name, chart_data, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
