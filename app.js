// ── Custom cursor (High Performance) ──────────────────────────────
const cur = document.getElementById('cur');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateCursor() {
  curX += (mouseX - curX) * 0.15;
  curY += (mouseY - curY) * 0.15;
  cur.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(updateCursor);
}
updateCursor();

// ── Particle burst ───────────────────────────────────────────────
const PAL = { dog:'#ff6b6b', joke:'#ffd93d', user:'#6bcb77', posts:'#4d96ff' };
function burst(e, color) {
  const N = 12;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.className = 'par';
    const ang = (i / N) * 360;
    const dist = 45 + Math.random() * 55;
    const dx = Math.cos(ang * Math.PI / 180) * dist;
    const dy = Math.sin(ang * Math.PI / 180) * dist;
    Object.assign(p.style, {
      left: e.clientX + 'px', top: e.clientY + 'px',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      '--dx': dx + 'px', '--dy': dy + 'px'
    });
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

// ── Utility ──────────────────────────────────────────────────────
function setStatus(id, state) {
  const dot = document.getElementById('sd-' + id);
  const lbl = document.getElementById('st-' + id);
  if (dot && lbl) {
    dot.className = 'sd ' + state;
    lbl.textContent = { fetching:'fetching…', done:'loaded', err:'error' }[state] ?? 'idle';
  }
}

function showLoad(id) {
  const res = document.getElementById('res-' + id);
  if (res) res.innerHTML = `<div class="ldw"><div class="ring"></div><div class="ldtxt">Contacting API…</div></div>`;
  const btn = document.getElementById('btn-' + id);
  if (btn) btn.disabled = true;
  setStatus(id, 'fetching');
}

function showErr(id, msg) {
  const res = document.getElementById('res-' + id);
  if (res) res.innerHTML = `<div class="ebox"><div class="eico">⚠️</div><div class="emsg">${msg}</div></div>`;
  const btn = document.getElementById('btn-' + id);
  if (btn) btn.disabled = false;
  setStatus(id, 'err');
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('on');
    setTimeout(() => t.classList.remove('on'), 2500);
  }
}

// ── API Functions ────────────────────────────────────────────────
let _dogUrl = '';

async function fetchDog(e) {
  if (e) burst(e, PAL.dog);
  showLoad('dog');
  try {
    const r = await fetch('https://dog.ceo/api/breeds/image/random', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${r.status}: Failed`);
    const data = await r.json();
    _dogUrl = data.message;
    const segs = _dogUrl.split('/');
    const breed = (segs[segs.length - 2] ?? 'unknown').replace(/-/g, ' ');
    document.getElementById('res-dog').innerHTML = `<div style="width:100%"><img class="dimg" src="${_dogUrl}" alt="dog" onload="setStatus('dog', 'done')" /><span class="btag">🐕 ${breed}</span></div>`;
    document.getElementById('btn-cpd').style.display = 'flex';
  } catch (err) { showErr('dog', err.message); }
  document.getElementById('btn-dog').disabled = false;
}

async function fetchJoke(e) {
  if (e) burst(e, PAL.joke);
  showLoad('joke');
  try {
    const r = await fetch('https://official-joke-api.appspot.com/random_joke', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${r.status}: Failed`);
    const data = await r.json();
    document.getElementById('res-joke').innerHTML = `<div class="jwrap"><div class="jq">🎤 ${data.setup}</div><div class="jsep"><div class="jline"></div><span>💡</span><div class="jline"></div></div><div class="jp">${data.punchline}</div></div>`;
    document.getElementById('btn-nj').style.display = 'flex';
    setStatus('joke', 'done');
  } catch (err) { showErr('joke', err.message); }
  document.getElementById('btn-joke').disabled = false;
}

async function fetchUser(e) {
  if (e) burst(e, PAL.user);
  showLoad('user');
  try {
    const r = await fetch('https://randomuser.me/api/', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`${r.status}: Failed`);
    const data = await r.json();
    const u = data.results[0];
    const name = `${u.name.first} ${u.name.last}`;
    document.getElementById('res-user').innerHTML = `<div class="uwrap"><div class="uhead"><img class="uava" src="${u.picture.medium}" /><div class="uname">${name}</div></div><div class="ufs"><div class="uf"><span class="fl">📧 Email</span> <span class="fv">${u.email}</span></div><div class="uf"><span class="fl">🌍 Country</span> <span class="fv">${u.location.country}</span></div><div class="uf"><span class="fl">📞 Phone</span> <span class="fv">${u.phone}</span></div></div></div>`;
    document.getElementById('btn-nu').style.display = 'flex';
    setStatus('user', 'done');
  } catch (err) { showErr('user', err.message); }
  document.getElementById('btn-user').disabled = false;
}

async function fetchPosts(e) {
  if (e) burst(e, PAL.posts);
  showLoad('posts');
  try {
    const start = Math.floor(Math.random() * 95) + 1;
    const posts = await Promise.all([start, start+1, start+2].map(id => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { cache: 'no-cache' }).then(r => r.json())));
    document.getElementById('res-posts').innerHTML = `<div class="pwrap">${posts.map(p => `<div class="pitem"><div class="pt">${p.title}</div><div class="pb">${p.body.slice(0, 70)}...</div></div>`).join('')}</div>`;
    document.getElementById('btn-np').style.display = 'flex';
    setStatus('posts', 'done');
  } catch (err) { showErr('posts', err.message); }
  document.getElementById('btn-posts').disabled = false;
}

function copyDog() { if(_dogUrl) navigator.clipboard.writeText(_dogUrl).then(() => toast('🐾 Dog URL copied!')) }

// Cursor hover effects
document.querySelectorAll('button, a').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

console.info("🚀 Modular Structure Restored");
