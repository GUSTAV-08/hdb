// Elements
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const consoleEl = document.getElementById('console');
const bgMusic = document.getElementById('bg-music');
const kanjiOverlay = document.getElementById('kanji-overlay');
const controls = document.querySelector('.module-controls');

// Full text to print (use exact text you provided)
const consoleText = `> SYSTEM BOOT SEQUENCE — Protocol E-17
Initializing...
[██████████] 100%
> HELLO DEAR USER 
Detected event: 17 JANUARY — 誕生日 (tanjoubi).
Loading PERSONA SCAN...
ご挨拶エルビラ
[●●●●●●●●●●] Smartness... 100%
　· INFO: Neural profile: stable.
[●●●●●●●●●●] Beauty... 100%
　· INFO: Visual-scan confidence: high.
[●●●●●●●●●●] Cuteness... 100%
　· INFO: Cute-index: MAX.
[●●●●●●●●●●] Kindness... 100%
　· INFO: Compassion matrix: online.
[●●●●●●●●●○] Humor / Sarcasm Resistance... 90%
　· NOTE: Meme tolerance: above average.
[●●●●●●●●●●] Japanese affinity (日本語) ... HIGH
　· NOTE: language-skill detected: proficient.
[●●●●●●●●●●] Favorite character alignment... Xiao (Anemo) — DETECTED
　· NOTE: wind-echo signature matched.
[●●●●●●●●●●] Gacha engagement level... HIGH
　· WARNING: excitement parameter elevated.
Attempting deeper / sensitive analysis:
> Initiating: AFFECTIONAL METRICS SUBROUTINE
[□□□□□□□□□□] Affection metrics... 0%
　· Processing...
[■□□□□□□□□□] Affection metrics... 10%
　· STATUS: correlating social vectors...
　· [GLITCH] minor packet loss (0x0A)
[■■■□□□□□□□] Affection metrics... 30%
　· STATUS: pattern forming...
　· [GLITCH] transliteration anomaly: "r◌m◌ntic" detected
[■■■■■□□□□□] Affection metrics... 50%
　· STATUS: attempting human-context map...
　· [GLITCH] symbolic kernel unstable — retrying
[████□□□□□□] Affection metrics... 70%
　· WARNING: emotional kernel heating
　· [GLITCH] 0xF3A: <3> sequence corrupted
[███████□□□] Affection metrics... 85%
　· RETRY COUNT: 3
　· [GLITCH] partial overwrite: "love?" → "l◌v◌?"
[██████████] Affection metrics... 100%
　· FINALIZING...
> ERROR_404: DATA_NOT_FOUND
---
Attempting: EXTENDED EMOTIONAL ANALYSIS
> Accessing deeper modules...
> Affection levels… ERROR
　愛　■■　錯　断♥　？
　■　龍　　[███████□□□] Re-evaluating input stream...
　· RETRY COUNT: 3
　· [GLITCH] data overwrite — affection_index = null
> Emotional vulnerability… ACCESS RESTRICTED
　· STATUS: 403_FORBIDDEN
　· [警告] system barrier detected
　· [GLITCH] translation loss: 感情 → ？？？
　· override attempt… FAILURE (0xE17)
> Personal feelings… PERMISSION DENIED
　· ACCESS_LOG: “private directory /heart/locked”
　· SECURITY REASON: user_confidential
　· [ERROR] decrypt_key = undefined
　· 再試行 (↯retrying...) — FAILED
> Heart-rate fluctuations… DATA INCONCLUSIVE
　· BPM: fluctuating between 000–∞
　· [GLITCH] sensor overload — ♥ mod■ule o♥erheati♥ng↯↯
　· ERROR_213: 心拍数 不安定
　· [修復不♥能] cannot restore core pattern
> Emotional alignment… CANNOT BE CALCULATED
　· [GLITCH] metric conflict detected
　· 感性衝突: empathy core → ↯■↯unsta■ble
　· RESULT: 破損データ (corrupted data)
　· Final attempt: re-align emotion vector... FAILED
---
--- SYSTEM STABILITY: COMPROMISED ---
[⛔] INTERNAL WARNING: anomalous emotional interference
[GLITCH STREAM]
> [GLT] 0x0B7: 情報読み取り不能■
[GLT] 0x0B8: translit_error: "e-m-o-t-i-o-n" -> "e-■-♥o-■-n"
[GLT] 0x0B9: kernel panic: h↯eart_module ↯ overload
[GLT] 0x0BA: memory leak: fondness_cache -> leaking bytes
> 情報不足 (じょうほうぶそく) — Insufficient data.
ALTERNATIVE ANALYSIS REQUIRED.
[NOTICE] Primary emotional pathway unstable.
[NOTICE] Secondary protocol queued.
> For completion of the sequence, please proceed to the next module.
(Press ▶ START to continue)`;

// Typing speed (middle)
const typingDelay = 48;

// State
let idx = 0;
let typing = false;
let typingTimer = null;

// Helpers: append char preserving spacing
function appendChar(ch){
  consoleEl.textContent += ch;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Glitch overlay: style 2 = error-code style kanji bubbles
function showKanjiGlitch(duration = 1000){
  const messages = [
    '[ERR: 愛]', '[SYS: 龍]', '[DBG: 錯]', '[ERR: 心]', '[WARN: 断]',
    '[ERR: 0xE17]', '[GLT: 0x0B8]', '[GLT: 0x0B9]'
  ];
  // pick 2 random messages and show them as bubbles
  kanjiOverlay.innerHTML = '';
  const a = document.createElement('div'); a.className='kanji-bubble'; a.textContent = messages[Math.floor(Math.random()*messages.length)];
  const b = document.createElement('div'); b.className='kanji-bubble'; b.textContent = messages[Math.floor(Math.random()*messages.length)];
  kanjiOverlay.appendChild(a); kanjiOverlay.appendChild(b);
  kanjiOverlay.style.opacity = '1';
  // position them slightly offset
  a.style.marginRight = '12px';
  b.style.marginLeft = '12px';
  // add glitch class to console
  consoleEl.classList.add('console-glitch');
  setTimeout(()=>{
    kanjiOverlay.style.opacity = '0';
    consoleEl.classList.remove('console-glitch');
    kanjiOverlay.innerHTML = '';
  }, duration);
}

// Typing loop
function typeLoop(){
  if(idx < consoleText.length){
    const ch = consoleText.charAt(idx++);
    appendChar(ch);
    typingTimer = setTimeout(typeLoop, typingDelay);
  } else {
    typing = false;
    // step 1: combined glitch: longer glitch (C + B)
    showKanjiGlitch(900);
    // step 2: standstill (console waits)
    // step 3: after 3 seconds highlight Next
    setTimeout(()=> {
      nextBtn.classList.add('highlight');
      // optionally bring focus
      nextBtn.focus();
    }, 3000);
  }
}

// Button behaviors
startBtn.addEventListener('click', ()=>{
  if(typing) return;
  // reset area, begin
  consoleEl.textContent = '';
  idx = 0;
  typing = true;
  // small body flash
  document.body.classList.add('starting');
  setTimeout(()=> document.body.classList.remove('starting'), 900);

  // start music (will play only after user gesture)
  try {
    bgMusic.volume = 0.32;
    // load on demand to avoid prefetch cost
    if(bgMusic.getAttribute('preload') !== 'auto') bgMusic.load();
    bgMusic.play().catch(()=>{ /* ignore autoplay blocks */ });
  } catch(e){ /* ignore */ }

  // start typing shortly after flash
  setTimeout(()=> typeLoop(), 260);
});

restartBtn.addEventListener('click', ()=>{
  location.reload();
});

nextBtn.addEventListener('click', () => {
  // Выходим из module1 и заходим в папку module2
  window.location.href = '../module2/quest.html'; 
});

// small UX: reveal controls when pointer near top (desktop)
document.addEventListener('mousemove',(e)=>{
  if(e.clientY < 120) controls.style.opacity = '1';
  else controls.style.opacity = '0.28';
});

// keyboard shortcut S to start
document.addEventListener('keydown',(e)=>{
  if(e.key.toLowerCase()==='s') startBtn.click();
});
