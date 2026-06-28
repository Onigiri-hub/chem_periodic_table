let puzzleElements = [];
let puzzleStyle = 'drag';
let puzzlePeriod = '4';
let puzzleTimer = null;
let puzzleSeconds = 0;
let puzzlePlaced = 0;
let submittedDocId = null;

// ピンチズーム状態
let ptZoom = 1.0;
let ptPinching = false;
let ptPinchDist0 = 0;
let ptZoom0 = 1.0;
let ptZoomInitialized = false;

function initPuzzleZoom() {
  if (ptZoomInitialized) return;
  ptZoomInitialized = true;
  const main = document.querySelector('#screen-puzzle-game .puzzle-main');
  if (!main) return;

  function pinchDist(t) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  }

  main.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      ptPinching = true;
      ptPinchDist0 = pinchDist(e.touches);
      ptZoom0 = ptZoom;
    }
  }, { passive: true });

  main.addEventListener('touchmove', e => {
    if (!ptPinching || e.touches.length !== 2) return;
    e.preventDefault();
    const scale = pinchDist(e.touches) / ptPinchDist0;
    ptZoom = Math.min(Math.max(ptZoom0 * scale, 0.3), 4.0);
    const c = document.getElementById('periodic-table-container');
    if (c) c.style.zoom = ptZoom;
  }, { passive: false });

  main.addEventListener('touchend', () => { ptPinching = false; });
  main.addEventListener('touchcancel', () => { ptPinching = false; });
}

function startPuzzle() {
  puzzlePeriod = document.getElementById('puzzle-period').value;
  puzzleStyle = document.getElementById('puzzle-style').value;
  const cfg = parsePeriodSetting(puzzlePeriod);
  puzzleElements = getElementsByPeriod(cfg.max, cfg.ln, cfg.ac);
  puzzlePlaced = 0;
  puzzleSeconds = 0;
  buildPeriodicTable('periodic-table-container', puzzleStyle);
  // ズームをリセット
  ptZoom = 1.0;
  const ptc = document.getElementById('periodic-table-container');
  if (ptc) ptc.style.zoom = '';
  initPuzzleZoom();
  const sidebar = document.querySelector('#screen-puzzle-game .puzzle-sidebar');
  if (puzzleStyle === 'drag') {
    sidebar.style.display = '';
    buildSidebar();
  } else {
    sidebar.style.display = 'none';
    document.getElementById('element-list').innerHTML = '';
  }
  showScreen('screen-puzzle-game');
  startPuzzleTimer();
}

function startPuzzleTimer() {
  clearInterval(puzzleTimer);
  puzzleSeconds = 0;
  updateTimerDisplay();
  puzzleTimer = setInterval(() => {
    puzzleSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const h = String(Math.floor(puzzleSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((puzzleSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(puzzleSeconds % 60).padStart(2, '0');
  const t = `${h}:${m}:${s}`;
  const el = document.getElementById('puzzle-timer');
  if (el) el.textContent = `Time: ${t}`;
}

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// 周期表構造: [period][group] に元素が入る
// ランタノイド・アクチノイドは別行
const PT_LAYOUT = {
  1:  [1, 18],
  2:  [1, 2, 13, 14, 15, 16, 17, 18],
  3:  [1, 2, 13, 14, 15, 16, 17, 18],
  4:  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
  5:  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
  6:  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
  7:  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
};

function buildPeriodicTable(containerId, style) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const table = document.createElement('div');
  table.className = 'periodic-table';
  container.appendChild(table);

  const cfg = parsePeriodSetting(puzzlePeriod);
  const maxPeriod = cfg.max;

  // 3周期以下はd-blockを省略して10列コンパクト表示
  const compact = maxPeriod <= 3;
  if (compact) {
    table.style.gridTemplateColumns = 'repeat(10, 1fr)';
    table.style.minWidth = '510px';
  }

  // 元素をperiod+groupでマップ化
  const elementMap = {};
  puzzleElements.forEach(el => {
    if (el.category !== 'lanthanide' && el.category !== 'actinide') {
      elementMap[`${el.period}-${el.group}`] = el;
    }
  });

  // コンパクト時: [1族, 2族, 空, 空, 13〜18族]の10列
  const compactGroups = [1, 2, null, null, 13, 14, 15, 16, 17, 18];

  for (let period = 1; period <= maxPeriod; period++) {
    const groups = compact ? compactGroups : Array.from({length: 18}, (_, i) => i + 1);
    for (const group of groups) {
      const cell = document.createElement('div');
      const el = group !== null ? elementMap[`${period}-${group}`] : null;

      if (!el) {
        // 空セル
        cell.className = 'pt-cell empty';
        // 第3族のランタノイド・アクチノイドプレースホルダー
        if (group === 3 && (period === 6 || period === 7)) {
          cell.className = 'pt-cell';
          cell.style.background = '#555';
          cell.style.color = '#fff';
          cell.style.fontSize = '0.55rem';
          cell.style.fontWeight = '700';
          cell.innerHTML = period === 6 ? 'Ln<br>→' : 'Ac<br>→';
          cell.style.borderColor = '#333';
        }
      } else {
        // 対象元素セル
        cell.dataset.n = el.n;
        cell.dataset.symbol = el.symbol;
        cell.dataset.period = period;
        cell.dataset.group = group;

        if (style === 'drag') {
          cell.className = 'pt-cell target';
          cell.id = `cell-${el.n}`;
          cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
          cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
          cell.addEventListener('drop', e => onDrop(e, el));
        } else {
          // 入力モード
          cell.className = 'pt-cell target';
          cell.id = `cell-${el.n}`;
          cell.tabIndex = 0;
          cell.addEventListener('click', () => openInput(cell, el));
        }
      }
      table.appendChild(cell);
    }
  }

  // ランタノイド行
  if (cfg.ln) {
    const lnElements = puzzleElements.filter(e => e.category === 'lanthanide');
    appendFRow(table, 'Ln →', lnElements, 'ln', style);
  }
  // アクチノイド行
  if (cfg.ac) {
    const acElements = puzzleElements.filter(e => e.category === 'actinide');
    appendFRow(table, 'Ac →', acElements, 'ac', style);
  }
}

function appendFRow(table, label, elements, prefix, style) {
  // ラベル（2列分）
  const labelCell = document.createElement('div');
  labelCell.className = prefix === 'ln' ? 'ln-row-label' : 'ac-row-label';
  labelCell.textContent = label;
  labelCell.style.gridColumn = '1 / 3';
  table.appendChild(labelCell);

  // 14個分（57-71 or 89-103）の空白3列目 + 要素14個
  // 列 3〜16 に対応させる
  for (let i = 0; i < 14; i++) {
    const el = elements[i];
    const cell = document.createElement('div');
    if (!el) {
      cell.className = 'pt-cell empty';
    } else {
      cell.dataset.n = el.n;
      cell.dataset.symbol = el.symbol;
      cell.id = `cell-${el.n}`;
      if (style === 'drag') {
        cell.className = 'pt-cell target';
        cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', e => onDrop(e, el));
      } else {
        cell.className = 'pt-cell target';
        cell.tabIndex = 0;
        cell.addEventListener('click', () => openInput(cell, el));
      }
    }
    table.appendChild(cell);
  }
  // 残り2列を空白で埋める（18列グリッドに合わせる）
  for (let i = 0; i < 2; i++) {
    const empty = document.createElement('div');
    empty.className = 'pt-cell empty';
    table.appendChild(empty);
  }
}

// ドラッグ&ドロップ
let dragEl = null;

function buildSidebar() {
  const sidebar = document.getElementById('element-list');
  sidebar.innerHTML = '';
  const shuffled = [...puzzleElements].sort(() => Math.random() - 0.5);
  shuffled.forEach(el => {
    const card = document.createElement('div');
    card.className = 'sidebar-card';
    card.id = `side-${el.n}`;
    card.textContent = el.symbol;
    card.draggable = true;
    card.dataset.n = el.n;
    card.addEventListener('dragstart', e => {
      dragEl = el;
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', el.n);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('touchstart', e => onSidebarTouchStart(e, el, card), { passive: true });
    sidebar.appendChild(card);
  });
}

// === タッチ操作対応（長押し500msでドラッグ、早期移動でスクロール） ===
let touchGhost = null;
let touchHighlightedCell = null;
let touchOffsetX = 0;
let touchOffsetY = 0;
let sidebarTouch = null;

function onSidebarTouchStart(e, el, card) {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  const rect = card.getBoundingClientRect();
  clearSidebarTouch();

  sidebarTouch = {
    el, card,
    startX: touch.clientX,
    startY: touch.clientY,
    curX: touch.clientX,
    curY: touch.clientY,
    offsetX: touch.clientX - rect.left,
    offsetY: touch.clientY - rect.top,
    phase: 'wait', // 'wait' | 'scroll' | 'drag'
    timer: setTimeout(activateSidebarDrag, 150),
  };

  document.addEventListener('touchmove',   onSidebarTouchMove,   { passive: false });
  document.addEventListener('touchend',    onSidebarTouchEnd,    { passive: false });
  document.addEventListener('touchcancel', onSidebarTouchCancel, { passive: false });
}

function activateSidebarDrag() {
  if (!sidebarTouch || sidebarTouch.phase !== 'wait') return;
  const { el, card, curX, curY } = sidebarTouch;
  sidebarTouch.phase = 'drag';

  dragEl = el;
  card.style.opacity = '0.3';
  if (navigator.vibrate) navigator.vibrate(30);

  const rect = card.getBoundingClientRect();
  const offsetX = curX - rect.left;
  const offsetY = curY - rect.top;
  touchGhost = card.cloneNode(true);
  Object.assign(touchGhost.style, {
    position: 'fixed',
    width:  rect.width  + 'px',
    height: rect.height + 'px',
    left:   rect.left + 'px',
    top:    rect.top  + 'px',
    opacity: '0.85',
    pointerEvents: 'none',
    zIndex: '9999',
    margin: '0',
    transform: 'scale(1.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    transition: 'none',
  });
  document.body.appendChild(touchGhost);
  touchOffsetX = offsetX;
  touchOffsetY = offsetY;
}

function onSidebarTouchMove(e) {
  if (!sidebarTouch) return;
  const touch = e.touches[0];

  if (sidebarTouch.phase === 'wait') {
    sidebarTouch.curX = touch.clientX;
    sidebarTouch.curY = touch.clientY;
    const dist = Math.hypot(
      touch.clientX - sidebarTouch.startX,
      touch.clientY - sidebarTouch.startY
    );
    if (dist > 8) {
      // 500ms 経たずに動いた → スクロールモードへ
      clearTimeout(sidebarTouch.timer);
      sidebarTouch.phase = 'scroll';
    }
    return; // preventDefault しない → ネイティブスクロール継続
  }

  if (sidebarTouch.phase === 'scroll') return;

  // ─── drag フェーズ ───
  e.preventDefault();
  if (!touchGhost) return;

  touchGhost.style.left = (touch.clientX - touchOffsetX) + 'px';
  touchGhost.style.top  = (touch.clientY - touchOffsetY) + 'px';

  if (touchHighlightedCell) {
    touchHighlightedCell.classList.remove('drag-over');
    touchHighlightedCell = null;
  }
  touchGhost.style.visibility = 'hidden';
  const below = document.elementFromPoint(touch.clientX, touch.clientY);
  touchGhost.style.visibility = '';
  if (below) {
    const cell = below.closest('.pt-cell.target');
    if (cell) { cell.classList.add('drag-over'); touchHighlightedCell = cell; }
  }
}

function onSidebarTouchEnd(e) {
  removeSidebarDocListeners();
  if (!sidebarTouch) return;
  const { phase, card } = sidebarTouch;
  clearTimeout(sidebarTouch.timer);

  if (touchHighlightedCell) touchHighlightedCell.classList.remove('drag-over');

  if (phase === 'drag') {
    const touch = e.changedTouches[0];
    if (touchGhost) touchGhost.style.visibility = 'hidden';
    const below = document.elementFromPoint(touch.clientX, touch.clientY);
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    card.style.opacity = '';

    if (below && dragEl) {
      const cell = below.closest('.pt-cell.target');
      if (cell && cell.dataset.n) {
        const targetN = parseInt(cell.dataset.n);
        const targetEl = puzzleElements.find(x => x.n === targetN);
        if (targetEl) {
          if (dragEl.n === targetEl.n) {
            placedCorrect(cell, dragEl);
          } else {
            card.classList.add('flyback');
            setTimeout(() => card.classList.remove('flyback'), 300);
          }
        }
      }
    }
  } else {
    if (touchGhost) { touchGhost.remove(); touchGhost = null; }
    if (card) card.style.opacity = '';
  }

  touchHighlightedCell = null;
  dragEl = null;
  sidebarTouch = null;
}

function onSidebarTouchCancel() {
  removeSidebarDocListeners();
  clearSidebarTouch();
}

function removeSidebarDocListeners() {
  document.removeEventListener('touchmove',   onSidebarTouchMove);
  document.removeEventListener('touchend',    onSidebarTouchEnd);
  document.removeEventListener('touchcancel', onSidebarTouchCancel);
}

function clearSidebarTouch() {
  if (sidebarTouch) {
    clearTimeout(sidebarTouch.timer);
    if (sidebarTouch.card) sidebarTouch.card.style.opacity = '';
    sidebarTouch = null;
  }
  if (touchGhost) { touchGhost.remove(); touchGhost = null; }
  if (touchHighlightedCell) {
    touchHighlightedCell.classList.remove('drag-over');
    touchHighlightedCell = null;
  }
  dragEl = null;
}

function onDrop(e, targetEl) {
  e.preventDefault();
  const cell = document.getElementById(`cell-${targetEl.n}`);
  cell.classList.remove('drag-over');
  if (!dragEl) return;

  if (dragEl.n === targetEl.n) {
    // 正解！
    placedCorrect(cell, dragEl);
  } else {
    // 不正解 → しゅっと戻る
    const sideCard = document.getElementById(`side-${dragEl.n}`);
    if (sideCard) {
      sideCard.classList.add('flyback');
      setTimeout(() => sideCard.classList.remove('flyback'), 300);
    }
  }
  dragEl = null;
}

const putSound = new Audio('sounds/put.mp3');

function placedCorrect(cell, el) {
  putSound.currentTime = 0;
  putSound.play().catch(() => {});
  // サイドバーから削除
  const sideCard = document.getElementById(`side-${el.n}`);
  if (sideCard) sideCard.remove();

  // セルを埋める
  cell.className = 'pt-cell filled';
  cell.style.background = CATEGORY_COLORS[el.category] || '#eee';
  cell.style.border = '1.5px solid rgba(0,0,0,0.15)';
  cell.innerHTML = `
    <span class="cell-num">${el.n}</span>
    <span class="cell-symbol">${el.symbol}</span>
    <span class="cell-name">${el.name}</span>
  `;
  cell.classList.add('sparkle');
  setTimeout(() => cell.classList.remove('sparkle'), 500);

  puzzlePlaced++;
  if (puzzlePlaced >= puzzleElements.length) {
    onPuzzleComplete();
  }
}

// 入力モード
let activeInputCell = null;
let activeInputEl = null;

function openInput(cell, el) {
  if (activeInputCell) {
    activeInputCell.innerHTML = '';
    activeInputCell.className = 'pt-cell target';
  }
  activeInputCell = cell;
  activeInputEl = el;
  cell.innerHTML = '';
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.maxLength = 3;
  inp.style.cssText = 'width:100%; border:none; background:transparent; text-align:center; font-size:0.85rem; font-weight:700; outline:none;';
  cell.appendChild(inp);
  inp.focus();
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      checkInput(inp.value, cell, el);
    } else if (e.key === 'Escape') {
      cell.innerHTML = '';
      cell.className = 'pt-cell target';
      activeInputCell = null;
    }
  });
}

function checkInput(val, cell, el) {
  const normalized = val.trim().toLowerCase();
  const correct = el.symbol.toLowerCase();
  if (normalized === correct) {
    // 正解
    activeInputCell = null;
    placedCorrect(cell, el);
  } else {
    // 不正解 → しゅっと消える
    const inp = cell.querySelector('input');
    if (inp) {
      inp.classList.add('flyback');
      setTimeout(() => {
        inp.value = '';
        inp.classList.remove('flyback');
        inp.focus();
      }, 300);
    }
  }
}

function quitPuzzle() {
  clearInterval(puzzleTimer);
  showScreen('screen-title');
}

function onPuzzleComplete() {
  clearInterval(puzzleTimer);
  const timeStr = formatTime(puzzleSeconds);
  saveRanking(puzzlePeriod, puzzleStyle, puzzleSeconds);
  document.getElementById('complete-time').textContent = timeStr;
  document.getElementById('complete-time2').textContent = timeStr;
  submittedDocId = null;
  document.getElementById('player-name-input').value = '';
  const btn = document.getElementById('submit-ranking-btn');
  btn.disabled = false;
  btn.textContent = '投稿してランキングをみる';
  showScreen('screen-puzzle-complete');
}

async function submitAndShowRanking() {
  const nameInput = document.getElementById('player-name-input');
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  const btn = document.getElementById('submit-ranking-btn');
  btn.disabled = true;
  btn.textContent = '投稿中...';
  try {
    submittedDocId = await submitScore(name, puzzleSeconds, puzzlePeriod, puzzleStyle);
  } catch (e) {
    console.error('submitScore error:', e);
    btn.disabled = false;
    btn.textContent = '投稿してランキングをみる';
    return;
  }
  showGlobalRanking(submittedDocId);
}

async function showGlobalRanking(myDocId) {
  const list = document.getElementById('ranking-list');
  const styleLabel = puzzleStyle === 'drag' ? '穴埋め' : '自分で入力';
  document.getElementById('ranking-subtitle').textContent = `${puzzlePeriod}周期まで / ${styleLabel}`;
  list.innerHTML = '<p style="color:#888;text-align:center;padding:1rem;">読み込み中...</p>';
  showScreen('screen-ranking');

  let rankings;
  try {
    rankings = await fetchTopRankings(puzzlePeriod, puzzleStyle);
  } catch (e) {
    console.error(e);
    list.innerHTML = '<p style="color:#c00;text-align:center;">読み込みに失敗しました</p>';
    return;
  }

  list.innerHTML = '';
  if (rankings.length === 0) {
    list.innerHTML = '<p style="color:#888;">記録なし</p>';
    return;
  }

  rankings.forEach((entry, i) => {
    const isMe = !!myDocId && entry.id === myDocId;
    const item = document.createElement('div');
    item.className = `ranking-item${isMe ? ' my-entry' : ''}`;
    item.innerHTML = `
      <span class="rank-num">${i + 1}位</span>
      <span class="rank-name">${escapeHtml(entry.name)}</span>
      <span class="rank-time">${formatTime(entry.seconds)}</span>
      ${isMe ? '<span class="new-record">← YOU</span>' : ''}
    `;
    list.appendChild(item);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ランキング
function saveRanking(period, style, seconds) {
  const key = `ranking_${period}_${style}`;
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  saved.push(seconds);
  saved.sort((a, b) => a - b);
  localStorage.setItem(key, JSON.stringify(saved.slice(0, 10)));
}

