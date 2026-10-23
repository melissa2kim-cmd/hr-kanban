// 회의 메모 → 업무 카드 추출. ANTHROPIC_API_KEY가 없으면 501을 돌려주고 브라우저가 규칙 기반 파서를 쓴다.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(501).json({ error: 'AI not configured' });

  const { text = '', members = [], today = '' } = req.body || {};
  if (!text.trim() || text.length > 5000) return res.status(400).json({ error: 'invalid text' });

  const prompt = `오늘은 ${today}입니다. 팀원: ${members.join(', ')}.
아래 회의 메모에서 업무를 추출해 JSON만 출력하세요.
형식: {"items":[{"kind":"task|step|meeting","group":협업 번호(step만, 같은 협업은 같은 번호),"title":"할 일 또는 회의명(이름·날짜 표현 제외, 짧게)","owner":"팀원 이름 또는 빈 문자열","date":"YYYY-MM-DD 또는 빈 문자열","time":"HH:MM(meeting만)","attendees":["참석 팀원(meeting만)"]}]}
- "A가 끝나면 B", "→"처럼 순서가 이어지는 업무는 kind "step"으로, 순서대로 나열
- 회의 일정 문장은 kind "meeting"

회의 메모:
${text}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!r.ok) return res.status(502).json({ error: 'AI request failed' });
    const data = await r.json();
    const out = (data.content || []).map(b => b.text || '').join('');
    const json = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
    return res.status(200).json({ items: Array.isArray(json.items) ? json.items : [] });
  } catch (e) {
    return res.status(502).json({ error: 'AI parse failed' });
  }
};
