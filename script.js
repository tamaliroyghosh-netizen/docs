// Simple client UI - posts notes to Netlify function at /.netlify/functions/process
const notesEl = document.getElementById('notes');
const clearBtn = document.getElementById('clearBtn');
const sendBtn = document.getElementById('sendBtn');
const resultEl = document.getElementById('result');

clearBtn.addEventListener('click', () => {
  notesEl.value = '';
  resultEl.textContent = 'Cleared.';
});

sendBtn.addEventListener('click', async () => {
  const text = notesEl.value.trim();
  if (!text) {
    resultEl.textContent = 'Please paste or type something in the notes box first.';
    return;
  }

  resultEl.textContent = 'Processing…';

  try {
    // Netlify function endpoint (no API key exposed)
    const API_ENDPOINT = '/.netlify/functions/process';

    const resp = await fetch(API_ENDPOINT, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ notes: text })
    });

    if (!resp.ok) {
      const err = await resp.text();
      resultEl.textContent = `Server error: ${resp.status} — ${err}`;
      return;
    }

    const json = await resp.json();
    resultEl.textContent = json.result || JSON.stringify(json, null, 2);
  } catch (err) {
    resultEl.textContent = 'Network or script error: ' + err.message;
  }
});
