// ===== MOTION FORGE — ANIMATION PLAYGROUND JS =====

document.addEventListener('DOMContentLoaded', () => {
  const shape = document.querySelector('.anim-shape');
  const animObject = document.querySelector('.anim-object');
  const animSelect = document.getElementById('anim-select');
  const easingSelect = document.getElementById('easing-select');
  const durationSlider = document.getElementById('duration-slider');
  const durationVal = document.getElementById('duration-val');
  const delaySlider = document.getElementById('delay-slider');
  const delayVal = document.getElementById('delay-val');
  const directionSelect = document.getElementById('direction-select');
  const iterBtns = document.querySelectorAll('.iter-btn');
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const codeBlock = document.getElementById('code-block');
  const copyBtn = document.getElementById('copy-css-btn');
  const canvas = document.getElementById('easing-canvas');
  const ctx = canvas.getContext('2d');

  let currentIterations = 'infinite';

  // ===== KEYFRAME DEFINITIONS =====
  const KEYFRAMES = {
    bounce: {
      name: 'forge-bounce',
      css: `@keyframes forge-bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-60px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-30px); }
  85% { transform: translateY(-10px); }
}`
    },
    'fade-in': {
      name: 'forge-fade-in',
      css: `@keyframes forge-fade-in {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}`
    },
    'slide-up': {
      name: 'forge-slide-up',
      css: `@keyframes forge-slide-up {
  0% { opacity: 0; transform: translateY(80px); }
  100% { opacity: 1; transform: translateY(0); }
}`
    },
    'slide-in-left': {
      name: 'forge-slide-in-left',
      css: `@keyframes forge-slide-in-left {
  0% { opacity: 0; transform: translateX(-120px); }
  100% { opacity: 1; transform: translateX(0); }
}`
    },
    'rotate-in': {
      name: 'forge-rotate-in',
      css: `@keyframes forge-rotate-in {
  0% { opacity: 0; transform: rotate(-180deg) scale(0.3); }
  100% { opacity: 1; transform: rotate(0) scale(1); }
}`
    },
    'scale-up': {
      name: 'forge-scale-up',
      css: `@keyframes forge-scale-up {
  0% { opacity: 0; transform: scale(0.1) rotate(-10deg); }
  60% { transform: scale(1.15) rotate(3deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}`
    },
    flip: {
      name: 'forge-flip',
      css: `@keyframes forge-flip {
  0% { transform: perspective(400px) rotateY(0); }
  40% { transform: perspective(400px) rotateY(-20deg); }
  50% { opacity: 0.5; }
  100% { transform: perspective(400px) rotateY(360deg); opacity: 1; }
}`
    },
    shake: {
      name: 'forge-shake',
      css: `@keyframes forge-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`
    },
    'pulse-glow': {
      name: 'forge-pulse-glow',
      css: `@keyframes forge-pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); transform: scale(1); }
  50% { box-shadow: 0 0 60px rgba(139,92,246,0.6), 0 0 100px rgba(236,72,153,0.3); transform: scale(1.08); }
}`
    },
    wiggle: {
      name: 'forge-wiggle',
      css: `@keyframes forge-wiggle {
  0%, 100% { transform: rotate(0); }
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(8deg); }
  60% { transform: rotate(-5deg); }
  75% { transform: rotate(3deg); }
}`
    }
  };

  // ===== Update animation =====
  function updateAnimation() {
    const animKey = animSelect.value;
    const easing = easingSelect.value;
    const duration = durationSlider.value;
    const delay = delaySlider.value;
    const direction = directionSelect.value;
    const kf = KEYFRAMES[animKey];

    // Inject keyframes
    let styleTag = document.getElementById('forge-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'forge-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = kf.css;

    // Apply to shape
    shape.style.animation = 'none';
    shape.offsetHeight; // force reflow
    shape.style.animation = `${kf.name} ${duration}ms ${easing} ${delay}ms ${currentIterations === 'infinite' ? 'infinite' : currentIterations} ${direction}`;
    shape.style.animationFillMode = 'both';

    // Update CSS code display
    updateCode(kf, duration, delay, easing, direction);

    // Draw easing curve
    drawEasingCurve(easing);

    // Set playing state
    animObject.classList.add('playing');
    animObject.classList.remove('paused');
  }

  // ===== Update code block =====
  function updateCode(kf, duration, delay, easing, direction) {
    const iters = currentIterations === 'infinite' ? 'infinite' : currentIterations;
    codeBlock.innerHTML = `<span class="cmt">/* Generated by Motion Forge 🎬 */</span>

${kf.css}

<span class="cmt">/* Usage */</span>
<span class="sel">.element</span> {
  <span class="prop">animation</span>: <span class="val">${kf.name}</span>;
  <span class="prop">animation-duration</span>: <span class="num">${duration}ms</span>;
  <span class="prop">animation-timing-function</span>: <span class="val">${easing}</span>;
  <span class="prop">animation-delay</span>: <span class="num">${delay}ms</span>;
  <span class="prop">animation-iteration-count</span>: <span class="num">${iters}</span>;
  <span class="prop">animation-direction</span>: <span class="val">${direction}</span>;
}`;
  }

  // ===== Draw easing curve on canvas =====
  function drawEasingCurve(easing) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0b0914';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (w / 10) * i;
      const y = (h / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
      ctx.moveTo(0, y); ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Parse ease function
    let easingFunc;
    if (easing === 'linear') easingFunc = t => t;
    else if (easing === 'ease') easingFunc = bezier(0.25, 0.1, 0.25, 1.0);
    else if (easing === 'ease-in') easingFunc = bezier(0.42, 0, 1.0, 1.0);
    else if (easing === 'ease-out') easingFunc = bezier(0, 0, 0.58, 1.0);
    else if (easing === 'ease-in-out') easingFunc = bezier(0.42, 0, 0.58, 1.0);
    else {
      const match = easing.match(/cubic-bezier\(([^)]+)\)/);
      if (match) {
        const [x1, y1, x2, y2] = match[1].split(',').map(Number);
        easingFunc = bezier(x1, y1, x2, y2);
      } else {
        easingFunc = t => t;
      }
    }

    // Draw curve
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(139,92,246,0.5)';
    ctx.shadowBlur = 10;

    const padding = 20;
    const graphW = w - padding * 2;
    const graphH = h - padding * 2;

    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = padding + t * graphW;
      const y = padding + (1 - easingFunc(t)) * graphH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Diagonal reference
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, padding);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px monospace';
    ctx.fillText('0', padding - 5, h - padding + 15);
    ctx.fillText('1', w - padding - 5, h - padding + 15);
    ctx.fillText('1', w - padding + 8, padding + 4);
  }

  // Cubic bezier helper
  function bezier(x1, y1, x2, y2) {
    return function (t) {
      // Approximate using de Casteljau
      let cx = 3 * x1;
      let bx = 3 * (x2 - x1) - cx;
      let ax = 1 - cx - bx;
      let cy = 3 * y1;
      let by = 3 * (y2 - y1) - cy;
      let ay = 1 - cy - by;

      let sample = t;
      for (let i = 0; i < 10; i++) {
        let xt = ((ax * sample + bx) * sample + cx) * sample;
        let dx = ((3 * ax * sample + 2 * bx) * sample + cx);
        if (Math.abs(dx) < 0.001) break;
        sample -= (xt - t) / dx;
      }
      return ((ay * sample + by) * sample + cy) * sample;
    };
  }

  // ===== Micro-Interaction Preset Handlers (Trend #4) =====
  const microPresetBtns = document.querySelectorAll('.micro-preset-btn');

  const MICRO_PRESETS = {
    'custom': { anim: 'fade-in', easing: 'ease-in-out', duration: 800, delay: 0 },
    'button-hover': { anim: 'pulse-glow', easing: 'ease', duration: 300, delay: 0 },
    'button-click': { anim: 'scale-up', easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', duration: 200, delay: 0 },
    'toggle-switch': { anim: 'slide-in-left', easing: 'ease-out', duration: 250, delay: 0 },
    'loading-dot': { anim: 'bounce', easing: 'ease-in-out', duration: 600, delay: 0 },
    'skeleton': { anim: 'pulse-glow', easing: 'ease-in-out', duration: 1200, delay: 0 },
    'notification': { anim: 'slide-up', easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', duration: 400, delay: 0 }
  };

  microPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      microPresetBtns.forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-muted)';
        b.style.borderColor = 'rgba(255,255,255,0.06)';
      });
      btn.style.background = 'rgba(139,92,246,0.15)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';

      const preset = MICRO_PRESETS[btn.dataset.preset];
      if (preset) {
        animSelect.value = preset.anim;
        easingSelect.value = preset.easing;
        durationSlider.value = preset.duration;
        durationVal.textContent = `${preset.duration}ms`;
        delaySlider.value = preset.delay;
        delayVal.textContent = `${preset.delay}ms`;
        updateAnimation();
        showNotification(`${btn.textContent.trim()} preset applied`);
      }
    });
  });

  // ===== Event listeners =====
  animSelect.addEventListener('change', updateAnimation);
  easingSelect.addEventListener('change', updateAnimation);
  durationSlider.addEventListener('input', () => {
    durationVal.textContent = `${durationSlider.value}ms`;
    updateAnimation();
  });
  delaySlider.addEventListener('input', () => {
    delayVal.textContent = `${delaySlider.value}ms`;
    updateAnimation();
  });
  directionSelect.addEventListener('change', updateAnimation);

  iterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      iterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentIterations = btn.dataset.iter;
      updateAnimation();
    });
  });

  // Play/Pause/Reset
  playBtn.addEventListener('click', () => {
    animObject.classList.remove('paused');
    animObject.classList.add('playing');
    shape.style.animationPlayState = 'running';
  });

  pauseBtn.addEventListener('click', () => {
    animObject.classList.add('paused');
    shape.style.animationPlayState = 'paused';
  });

  resetBtn.addEventListener('click', () => {
    shape.style.animation = 'none';
    shape.offsetHeight;
    animObject.classList.remove('playing', 'paused');
    updateAnimation();
  });

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const rawCode = codeBlock.textContent || codeBlock.innerText;
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // ===== Toast notification =====
  function showNotification(msg) {
    const existing = document.querySelector('.theme-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'theme-toast fixed bottom-6 right-6 bg-slate-900 border border-violet-500/30 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 transition-all transform translate-y-10 opacity-0';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.textContent = msg;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 100);

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // ===== Initialize =====
  updateAnimation();
});
