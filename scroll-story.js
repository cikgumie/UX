/* ==========================================================================
   SCROLL STORY — INTERACTIVE LOGIC & DYNAMIC CODE EXPORTERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Settings & Controls
  const heightSelect = document.getElementById('viewport-height-select');
  const bgSpeedSlider = document.getElementById('bg-speed-slider');
  const midSpeedSlider = document.getElementById('mid-speed-slider');
  const foreSpeedSlider = document.getElementById('fore-speed-slider');
  const revealTriggerSelect = document.getElementById('reveal-trigger-select');
  const revealStyleSelect = document.getElementById('reveal-style-select');
  const pitchSlider = document.getElementById('pitch-slider');
  const yawSlider = document.getElementById('yaw-slider');

  // DOM Elements - Value Labels
  const heightLabel = document.getElementById('height-label');
  const bgSpeedLabel = document.getElementById('bg-speed-label');
  const midSpeedLabel = document.getElementById('mid-speed-label');
  const foreSpeedLabel = document.getElementById('fore-speed-label');
  const pitchLabel = document.getElementById('pitch-label');
  const yawLabel = document.getElementById('yaw-label');

  // DOM Elements - Viewport & Simulation Components
  const deviceChassis = document.getElementById('device-chassis');
  const viewportTrack = document.getElementById('viewport-track');
  const scrollTrackContent = document.getElementById('scroll-track-content');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const viewModeBtn = document.getElementById('view-mode-btn');

  // Telemetry Elements
  const telemetryPx = document.getElementById('telemetry-px');
  const telemetryPercent = document.getElementById('telemetry-percent');

  // Ruler Overlays
  const triggerStartLine = document.querySelector('.ruler-line.trigger-start');
  const triggerStartVal = document.querySelector('.ruler-line.trigger-start .trigger-val');

  // Animatable Elements inside Mockup
  const layerBg = document.getElementById('layer-bg');
  const layerMid = document.getElementById('layer-mid');
  const layerFore = document.getElementById('layer-fore');
  const stageTitle = document.getElementById('stage-title');
  const isometricCard = document.getElementById('isometric-card');
  const liveAngleLabel = document.getElementById('live-angle-label');
  const scrollWords = document.getElementById('scroll-words');

  // Code Panel
  const codeBlock = document.getElementById('code-block');
  const codeTabs = document.querySelectorAll('.code-tab');
  const copyBtn = document.getElementById('copy-story-btn');
  const formatLabel = document.getElementById('format-label');

  // Active States
  let currentFormat = 'css';
  let activeHeight = parseInt(heightSelect.value, 10); // 300

  // 1. UPDATE TRACK HEIGHT FOOTPRINT
  function updateTrackHeight() {
    activeHeight = parseInt(heightSelect.value, 10);
    heightLabel.textContent = `${activeHeight}vh`;
    // Map track content height to simulator
    // Simulated frame is 600px. Track height scales up
    scrollTrackContent.style.height = `${(activeHeight / 100) * 600}px`;
    updateRulers();
    triggerScrollMath();
  }

  // Update ruler marker offsets
  function updateRulers() {
    const totalHeight = scrollTrackContent.offsetHeight;
    const triggerPercent = parseInt(revealTriggerSelect.value, 10);

    triggerStartLine.style.top = `${(triggerPercent / 100) * totalHeight}px`;
    triggerStartVal.textContent = `${triggerPercent}%`;
  }

  // 2. TOGGLE SIMULATOR FRAME ASPECT (Mobile vs Desktop)
  viewModeBtn.addEventListener('click', () => {
    const isMobile = deviceChassis.classList.contains('mobile-view');
    if (isMobile) {
      deviceChassis.classList.remove('mobile-view');
      viewModeBtn.textContent = '📱 Mobile View';
      viewModeBtn.classList.remove('bg-cyan-500/10', 'text-cyan-400');
    } else {
      deviceChassis.classList.add('mobile-view');
      viewModeBtn.textContent = '🖥️ Desktop View';
      viewModeBtn.classList.add('bg-cyan-500/10', 'text-cyan-400');
    }
    // Recalculate heights on dimension reflow
    setTimeout(() => {
      updateTrackHeight();
    }, 400);
  });

  // 3. CORE SCROLL TIMELINE CALCULATIONS
  function triggerScrollMath() {
    const scrollTop = viewportTrack.scrollTop;
    const scrollHeight = viewportTrack.scrollHeight;
    const clientHeight = viewportTrack.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    const scrollPercent = progress * 100;

    // Telemetry updates
    telemetryPx.textContent = `${Math.round(scrollTop)}px`;
    telemetryPercent.textContent = `${Math.round(scrollPercent)}%`;

    // Progress Bar Fill
    progressBarFill.style.width = `${scrollPercent}%`;

    // Layer 1: Parallax Background
    const bgFactor = parseFloat(bgSpeedSlider.value);
    const bgOffset = scrollTop * bgFactor;
    layerBg.style.transform = `translate3d(0, ${bgOffset}px, 0)`;

    // Layer 2: Parallax Midground
    const midFactor = parseFloat(midSpeedSlider.value);
    const midOffset = -scrollTop * (1 - midFactor) * 0.4;
    layerMid.style.transform = `translate3d(0, ${midOffset}px, 0)`;

    // Layer 3: Parallax Foreground
    const foreFactor = parseFloat(foreSpeedSlider.value);
    const foreOffset = -scrollTop * (foreFactor - 1) * 0.5;
    layerFore.style.transform = `translate3d(0, ${foreOffset}px, 0)`;

    // Parallax Stage Header Title morphs (fades & slides up)
    const titleFade = Math.max(1 - (scrollTop / 300), 0);
    const titleShift = -scrollTop * 0.3;
    stageTitle.style.transform = `translate3d(0, ${titleShift}px, 0)`;
    stageTitle.style.opacity = titleFade;

    // 3D Isometric Card Reveals
    const triggerPercent = parseInt(revealTriggerSelect.value, 10);
    const maxPitch = parseInt(pitchSlider.value, 10);
    const maxYaw = parseInt(yawSlider.value, 10);
    const revealStyle = revealStyleSelect.value;

    if (scrollPercent >= triggerPercent) {
      // Calculate interpolation progress inside active timeline (from trigger% up to 85% depth)
      const rangeStart = triggerPercent;
      const rangeEnd = 80;
      const revealProgress = Math.min(Math.max((scrollPercent - rangeStart) / (rangeEnd - rangeStart), 0), 1);

      // Card reveals animations based on selector style
      isometricCard.style.opacity = revealProgress;

      if (revealStyle === 'fade-up') {
        const slideY = (1 - revealProgress) * 50;
        const currentPitch = revealProgress * maxPitch;
        const currentYaw = revealProgress * maxYaw;
        isometricCard.style.transform = `perspective(600px) translate3d(0, ${slideY}px, 0) rotateX(${currentPitch}deg) rotateY(${currentYaw}deg)`;
        liveAngleLabel.textContent = `${Math.round(currentPitch)}° / ${Math.round(currentYaw)}°`;
      } 
      else if (revealStyle === 'scale-in') {
        const scaleVal = 0.8 + (revealProgress * 0.2);
        const currentPitch = revealProgress * maxPitch;
        const currentYaw = revealProgress * maxYaw;
        isometricCard.style.transform = `perspective(600px) scale(${scaleVal}) rotateX(${currentPitch}deg) rotateY(${currentYaw}deg)`;
        liveAngleLabel.textContent = `${Math.round(currentPitch)}° / ${Math.round(currentYaw)}°`;
      } 
      else if (revealStyle === 'flip-3d') {
        const rotateZ = (1 - revealProgress) * -15;
        const currentPitch = revealProgress * maxPitch;
        const currentYaw = revealProgress * maxYaw;
        isometricCard.style.transform = `perspective(600px) rotateZ(${rotateZ}deg) rotateX(${currentPitch}deg) rotateY(${currentYaw}deg)`;
        liveAngleLabel.textContent = `${Math.round(currentPitch)}° / ${Math.round(currentYaw)}°`;
      }
    } else {
      // Card is hidden before trigger index
      isometricCard.style.opacity = '0';
      isometricCard.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
      liveAngleLabel.textContent = '0° / 0°';
    }

    // Typography Sequential Letter Reveals (Glow trigger spans between 45% and 85%)
    const textSpans = scrollWords.querySelectorAll('span');
    if (scrollPercent >= 40) {
      const textProgress = Math.min(Math.max((scrollPercent - 40) / 40, 0), 1);
      const activeCount = Math.round(textProgress * textSpans.length);

      textSpans.forEach((span, index) => {
        if (index < activeCount) {
          span.classList.add('active');
        } else {
          span.classList.remove('active');
        }
      });
    } else {
      textSpans.forEach(span => span.classList.remove('active'));
    }
  }

  // 4. CODE EXPORTERS TIMELINE SPEC
  function generateExporters() {
    const bgFactor = parseFloat(bgSpeedSlider.value);
    const midFactor = parseFloat(midSpeedSlider.value);
    const foreFactor = parseFloat(foreSpeedSlider.value);
    const triggerPercent = parseInt(revealTriggerSelect.value, 10);
    const maxPitch = parseInt(pitchSlider.value, 10);
    const maxYaw = parseInt(yawSlider.value, 10);
    const revealStyle = revealStyleSelect.value;

    if (currentFormat === 'css') {
      formatLabel.textContent = 'CSS Scroll-Driven Spec';
      codeBlock.innerHTML = `<span class="code-comment">/* CSS Scroll-Driven Animation standard (Modern Chrome supported) */</span>

<span class="code-comment">/* 1. Track Scroll Progress on Root or Container */</span>
<span class="code-selector">.scroll-container</span> {
  <span class="code-property">scroll-timeline-name</span>: --viewport-scroll;
  <span class="code-property">scroll-timeline-axis</span>: block;
}

<span class="code-comment">/* 2. Parallax background shifts */</span>
<span class="code-selector">.layer-bg</span> {
  <span class="code-property">animation</span>: parallax-bg linear;
  <span class="code-property">animation-timeline</span>: --viewport-scroll;
}
<span class="code-selector">.layer-mid</span> {
  <span class="code-property">animation</span>: parallax-mid linear;
  <span class="code-property">animation-timeline</span>: --viewport-scroll;
}
<span class="code-selector">.layer-fore</span> {
  <span class="code-property">animation</span>: parallax-fore linear;
  <span class="code-property">animation-timeline</span>: --viewport-scroll;
}

<span class="code-comment">/* 3. Interactive reveals & transforms */</span>
<span class="code-selector">.isometric-card</span> {
  <span class="code-property">animation</span>: card-reveal linear forwards;
  <span class="code-property">animation-timeline</span>: --viewport-scroll;
  <span class="code-property">animation-range</span>: ${triggerPercent}% 80%;
}

<span class="code-comment">/* keyframe timelines */</span>
<span class="code-keyword">@keyframes</span> parallax-bg {
  <span class="code-value">to</span> { <span class="code-property">transform</span>: translate3d(0, <span class="code-value">${(bgFactor * 300).toFixed(0)}px</span>, 0); }
}
<span class="code-keyword">@keyframes</span> parallax-mid {
  <span class="code-value">to</span> { <span class="code-property">transform</span>: translate3d(0, <span class="code-value">${(-120 * (1 - midFactor)).toFixed(0)}px</span>, 0); }
}
<span class="code-keyword">@keyframes</span> parallax-fore {
  <span class="code-value">to</span> { <span class="code-property">transform</span>: translate3d(0, <span class="code-value">${(-150 * (foreFactor - 1)).toFixed(0)}px</span>, 0); }
}
<span class="code-keyword">@keyframes</span> card-reveal {
  <span class="code-value">from</span> {
    <span class="code-property">opacity</span>: <span class="code-value">0</span>;
    <span class="code-property">transform</span>: <span class="code-value">perspective(600px) ${revealStyle === 'fade-up' ? 'translateY(50px)' : revealStyle === 'scale-in' ? 'scale(0.8)' : 'rotateZ(-15deg)'} rotateX(0deg) rotateY(0deg)</span>;
  }
  <span class="code-value">to</span> {
    <span class="code-property">opacity</span>: <span class="code-value">1</span>;
    <span class="code-property">transform</span>: <span class="code-value">perspective(600px) translateY(0px) rotateX(${maxPitch}deg) rotateY(${maxYaw}deg)</span>;
  }
}`;
    } else {
      formatLabel.textContent = 'Vanilla JS Fallback Spec';
      codeBlock.innerHTML = `<span class="code-comment">/* Lightweight high-performance JavaScript timeline fallback */</span>
<span class="code-keyword">const</span> container = document.querySelector(<span class="code-value">'.scroll-container'</span>);
<span class="code-keyword">const</span> bg = document.querySelector(<span class="code-value">'.layer-bg'</span>);
<span class="code-keyword">const</span> mid = document.querySelector(<span class="code-value">'.layer-mid'</span>);
<span class="code-keyword">const</span> fore = document.querySelector(<span class="code-value">'.layer-fore'</span>);
<span class="code-keyword">const</span> card = document.querySelector(<span class="code-value">'.isometric-card'</span>);

container.addEventListener(<span class="code-value">'scroll'</span>, () => {
  <span class="code-keyword">const</span> top = container.scrollTop;
  <span class="code-keyword">const</span> max = container.scrollHeight - container.clientHeight;
  <span class="code-keyword">const</span> pct = max > <span class="code-value">0</span> ? top / max : <span class="code-value">0</span>;
  <span class="code-keyword">const</span> scrollPct = pct * <span class="code-value">100</span>;

  <span class="code-comment">/* 1. Apply Parallax shifts */</span>
  bg.style.transform = <span class="code-value">\`translate3d(0, \${top * ${bgFactor}}px, 0)\`</span>;
  mid.style.transform = <span class="code-value">\`translate3d(0, \${-top * ${(1 - midFactor).toFixed(2)} * 0.4}px, 0)\`</span>;
  fore.style.transform = <span class="code-value">\`translate3d(0, \${-top * ${(foreFactor - 1).toFixed(2)} * 0.5}px, 0)\`</span>;

  <span class="code-comment">/* 2. Interactive reveals & 3D tilts */</span>
  <span class="code-keyword">if</span> (scrollPct >= <span class="code-value">${triggerPercent}</span>) {
    <span class="code-keyword">const</span> start = <span class="code-value">${triggerPercent}</span>;
    <span class="code-keyword">const</span> rangeVal = Math.min(Math.max((scrollPct - start) / (<span class="code-value">80</span> - start), <span class="code-value">0</span>), <span class="code-value">1</span>);
    
    card.style.opacity = rangeVal;
    <span class="code-keyword">const</span> pitch = rangeVal * <span class="code-value">${maxPitch}</span>;
    <span class="code-keyword">const</span> yaw = rangeVal * <span class="code-value">${maxYaw}</span>;
    
    ${revealStyle === 'fade-up' ? `card.style.transform = \`perspective(600px) translate3d(0, \${(1 - rangeVal) * 50}px, 0) rotateX(\${pitch}deg) rotateY(\${yaw}deg)\`;` : revealStyle === 'scale-in' ? `card.style.transform = \`perspective(600px) scale(\${0.8 + (rangeVal * 0.2)}) rotateX(\${pitch}deg) rotateY(\${yaw}deg)\`;` : `card.style.transform = \`perspective(600px) rotateZ(\${(1 - rangeVal) * -15}deg) rotateX(\${pitch}deg) rotateY(\${yaw}deg)\`;`}
  } <span class="code-keyword">else</span> {
    card.style.opacity = <span class="code-value">0</span>;
    card.style.transform = <span class="code-value">'perspective(600px) rotateX(0deg) rotateY(0deg)'</span>;
  }
});`;
    }
  }

  // 5. ATTACH LISTENERS FOR REAL-TIME RENDERING
  viewportTrack.addEventListener('scroll', triggerScrollMath);
  
  heightSelect.addEventListener('change', () => {
    updateTrackHeight();
    generateExporters();
  });

  bgSpeedSlider.addEventListener('input', () => {
    bgSpeedLabel.textContent = `${parseFloat(bgSpeedSlider.value).toFixed(1)}x`;
    triggerScrollMath();
    generateExporters();
  });

  midSpeedSlider.addEventListener('input', () => {
    midSpeedLabel.textContent = `${parseFloat(midSpeedSlider.value).toFixed(1)}x`;
    triggerScrollMath();
    generateExporters();
  });

  foreSpeedSlider.addEventListener('input', () => {
    foreSpeedLabel.textContent = `${parseFloat(foreSpeedSlider.value).toFixed(1)}x`;
    triggerScrollMath();
    generateExporters();
  });

  revealTriggerSelect.addEventListener('change', () => {
    updateRulers();
    triggerScrollMath();
    generateExporters();
  });

  revealStyleSelect.addEventListener('change', () => {
    triggerScrollMath();
    generateExporters();
  });

  pitchSlider.addEventListener('input', () => {
    pitchLabel.textContent = `${pitchSlider.value}deg`;
    triggerScrollMath();
    generateExporters();
  });

  yawSlider.addEventListener('input', () => {
    yawLabel.textContent = `${yawSlider.value}deg`;
    triggerScrollMath();
    generateExporters();
  });

  // Tab switcher
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFormat = tab.dataset.format;
      generateExporters();
    });
  });

  // Copy Code to Clipboard
  copyBtn.addEventListener('click', () => {
    // Strip HTML Tags for clean copy
    const cleanText = codeBlock.textContent;
    navigator.clipboard.writeText(cleanText).then(() => {
      // Trigger dynamic toast notification if global helper exists
      if (window.showNotification) {
        window.showNotification(`📋 Scroll Timeline Spec Copied Successfully!`);
      } else {
        alert('📋 Code copied to clipboard!');
      }
    });
  });

  // Initial Load Trigger
  updateTrackHeight();
  generateExporters();
});
