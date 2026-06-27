const cardFlipSound = new Audio('sounds/cards.mp3');

function playCardSound() {
  cardFlipSound.currentTime = 0;
  cardFlipSound.play();
}

let memoryPlayers = 2;
let memoryPeriod = '4';
let memoryCards = [];
let memoryFlipped = [];
let memoryLocked = false;
let memoryScores = [];
let memoryCurrentPlayer = 0;
let memoryHandCards = [];
let lastMemorySettings = {};

// タッチスクロール用
let _memScrollY = 0;
let _memScrollTop = 0;
let _memScrolled = false;
let _lastCardTouchTime = 0;
let _touchScrollInit = false;

function initMemoryTouchScroll() {
  if (_touchScrollInit) return;
  _touchScrollInit = true;
  const wrap = document.querySelector('.memory-board-wrap');
  if (!wrap) return;

  wrap.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    _memScrollY = e.touches[0].clientY;
    _memScrollTop = wrap.scrollTop;
    _memScrolled = false;
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    const dy = _memScrollY - e.touches[0].clientY;
    if (Math.abs(dy) > 8) _memScrolled = true;
    if (_memScrolled) wrap.scrollTop = _memScrollTop + dy;
  }, { passive: true });
}

function startMemory() {
  memoryPeriod = document.getElementById('memory-period').value;
  memoryPlayers = parseInt(document.getElementById('memory-players').value);
  lastMemorySettings = { period: memoryPeriod, players: memoryPlayers };
  initMemoryGame();
}

function restartMemory() {
  memoryPeriod = lastMemorySettings.period;
  memoryPlayers = lastMemorySettings.players;
  initMemoryGame();
}

function initMemoryGame() {
  const elements = getElementsForMemory(memoryPeriod);

  // ペア作成: 記号カード + 名前カード
  const pairs = [];
  elements.forEach(el => {
    pairs.push({ id: el.n, type: 'symbol', text: el.symbol, el, paired: el.n });
    pairs.push({ id: el.n, type: 'name',   text: el.name,   el, paired: el.n });
  });
  memoryCards = shuffle(pairs).map((c, idx) => ({ ...c, idx, flipped: false, matched: false }));

  memoryScores = Array(memoryPlayers).fill(0);
  memoryHandCards = Array(memoryPlayers).fill(null);
  memoryFlipped = [];
  memoryLocked = false;
  memoryCurrentPlayer = 0;

  buildMemoryHeader('memory-header');
  buildMemoryBoard();
  showScreen('screen-memory-game');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const PLAYER_CORNERS = ['tl', 'tr', 'bl', 'br'];

function buildMemoryHeader(containerId) {
  const header = document.getElementById(containerId);
  header.innerHTML = '';
  for (let p = 0; p < memoryPlayers; p++) {
    const area = document.createElement('div');
    area.className = `player-area player-corner-${PLAYER_CORNERS[p]}`;
    area.id = `player-area-${p}`;
    area.innerHTML = `
      <div class="player-badge ${p === memoryCurrentPlayer ? 'active' : ''}" id="player-badge-${p}">Player ${p+1}</div>
      <div class="player-hand" id="player-hand-${p}"></div>
      <div class="player-score" id="player-score-${p}">${memoryScores[p]}</div>
    `;
    header.appendChild(area);
  }
}

function updateMemoryHeader() {
  for (let p = 0; p < memoryPlayers; p++) {
    const badge = document.getElementById(`player-badge-${p}`);
    if (badge) {
      badge.className = `player-badge ${p === memoryCurrentPlayer ? 'active' : ''}`;
    }
    const score = document.getElementById(`player-score-${p}`);
    if (score) score.textContent = memoryScores[p];

    const hand = document.getElementById(`player-hand-${p}`);
    if (hand) {
      hand.innerHTML = '';
      if (memoryHandCards[p]) {
        const c = memoryHandCards[p];
        const card = document.createElement('div');
        card.className = 'hand-card';
        card.style.background = CATEGORY_COLORS[c.el.category] || '#eee';
        card.textContent = c.text;
        hand.appendChild(card);
      }
    }
  }
}

function buildMemoryBoard() {
  const board = document.getElementById('memory-board');
  board.innerHTML = '';

  const total = memoryCards.length;
  const CARD = 72; // 固定カードサイズ（px）
  const GAP  = 4;

  // 画面幅に収まる最大列数と、正方形レイアウトの列数を比較して小さい方を採用
  const isMobile = window.innerWidth <= 680;
  const sidePad = isMobile ? 16 : 220; // .memory-board-wrap の左右パディング合計
  const availW = window.innerWidth - sidePad;
  const colsByWidth  = Math.max(Math.floor(availW / (CARD + GAP)), 3);
  const colsBySquare = Math.ceil(Math.sqrt(total * 1.5));
  const cols = Math.min(colsBySquare, colsByWidth);

  board.style.gridTemplateColumns = `repeat(${cols}, ${CARD}px)`;

  const finalSize = CARD;

  memoryCards.forEach((c, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'memory-card';
    wrapper.id = `mcard-${i}`;
    wrapper.style.width = `${finalSize}px`;
    wrapper.style.height = `${Math.floor(finalSize * 1.1)}px`;

    const inner = document.createElement('div');
    inner.className = 'memory-card-inner';

    const front = document.createElement('div');
    front.className = 'memory-card-front';

    const back = document.createElement('div');
    back.className = `memory-card-back ${c.type === 'symbol' ? 'symbol' : ''}`;
    back.textContent = c.text;
    back.style.background = CATEGORY_COLORS[c.el.category] || '#fff';
    back.style.fontSize = c.type === 'symbol' ? `${Math.max(finalSize * 0.25, 10)}px` : `${Math.max(finalSize * 0.18, 8)}px`;

    inner.appendChild(front);
    inner.appendChild(back);
    wrapper.appendChild(inner);
    wrapper.addEventListener('touchend', () => {
      if (!_memScrolled) {
        _lastCardTouchTime = Date.now();
        onCardClick(i);
      }
    });
    wrapper.addEventListener('click', () => {
      if (Date.now() - _lastCardTouchTime > 500) onCardClick(i);
    });
    board.appendChild(wrapper);
  });

  initMemoryTouchScroll();
  const wrap = document.querySelector('.memory-board-wrap');
  if (wrap) wrap.scrollTop = 0;
}

function onCardClick(idx) {
  if (memoryLocked) return;
  const card = memoryCards[idx];
  if (card.flipped || card.matched) return;
  if (memoryFlipped.length >= 2) return;

  // めくる
  card.flipped = true;
  memoryFlipped.push(idx);
  flipCard(idx, true);
  playCardSound();

  // 手札エリアに表示
  memoryHandCards[memoryCurrentPlayer] = card;
  updateMemoryHeader();

  if (memoryFlipped.length === 2) {
    memoryLocked = true;
    setTimeout(() => checkMemoryMatch(), 2000);
  }
}

function flipCard(idx, toFront) {
  const el = document.getElementById(`mcard-${idx}`);
  if (!el) return;
  if (toFront) el.classList.add('flipped');
  else el.classList.remove('flipped');
}

function checkMemoryMatch() {
  const [i1, i2] = memoryFlipped;
  const c1 = memoryCards[i1];
  const c2 = memoryCards[i2];
  const isMatch = c1.paired === c2.paired && c1.type !== c2.type;

  if (isMatch) {
    // マッチ！
    c1.matched = true;
    c2.matched = true;
    memoryScores[memoryCurrentPlayer] += 2;
    memoryHandCards[memoryCurrentPlayer] = null;

    // カードを手札エリアへシュッと飛ばす
    flyCardsToHand(i1, i2, memoryCurrentPlayer);

    memoryFlipped = [];
    memoryLocked = false;
    updateMemoryHeader();

    // 全部マッチしたか確認
    if (memoryCards.every(c => c.matched)) {
      setTimeout(showMemoryResult, 700);
    }
  } else {
    // ミスマッチ → 裏に戻す
    [i1, i2].forEach(i => {
      memoryCards[i].flipped = false;
      flipCard(i, false);
    });
    playCardSound();
    memoryFlipped = [];
    memoryHandCards[memoryCurrentPlayer] = null;

    // ターン交代
    memoryCurrentPlayer = (memoryCurrentPlayer + 1) % memoryPlayers;
    memoryLocked = false;
    updateMemoryHeader();
  }
}

function flyCardsToHand(i1, i2, playerIndex) {
  const handEl = document.getElementById(`player-hand-${playerIndex}`);
  const handRect = handEl ? handEl.getBoundingClientRect() : null;

  [i1, i2].forEach((cardIdx, order) => {
    const el = document.getElementById(`mcard-${cardIdx}`);
    if (!el) return;

    const cardRect = el.getBoundingClientRect();
    const fromX = cardRect.left + cardRect.width  / 2;
    const fromY = cardRect.top  + cardRect.height / 2;
    const toX   = handRect ? handRect.left + handRect.width  / 2 : fromX;
    const toY   = handRect ? handRect.top  + handRect.height / 2 : fromY;
    const dx = toX - fromX;
    const dy = toY - fromY;

    el.style.position   = 'relative';
    el.style.zIndex     = '60';
    el.style.transition = 'none';
    el.style.transform  = '';

    setTimeout(() => {
      el.style.transition = `transform 0.42s ease-in, opacity 0.38s ease-in`;
      el.style.transform  = `translate(${dx}px, ${dy}px) scale(0.2)`;
      el.style.opacity    = '0';
      setTimeout(() => { el.style.visibility = 'hidden'; }, 430);
    }, order * 70);
  });
}

function showMemoryResult() {
  // 結果ヘッダーを更新
  buildMemoryHeader('memory-result-header');
  // 勝者判定
  const maxScore = Math.max(...memoryScores);
  const winners = memoryScores.map((s, i) => s === maxScore ? i : -1).filter(i => i >= 0);

  let titleText = '';
  if (memoryPlayers === 1) {
    titleText = 'Complete！';
  } else if (winners.length > 1) {
    titleText = 'ひきわけ！';
  } else {
    titleText = `Player ${winners[0]+1} の勝ち！`;
  }
  document.getElementById('result-title').textContent = titleText;
  showScreen('screen-memory-result');
}
