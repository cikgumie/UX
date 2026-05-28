// ===== DESIGN LANGUAGES PLAYGROUND - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('playground-container');
  const styleTabs = document.querySelectorAll('.style-tab-btn');
  const styleNameLabel = document.getElementById('style-name');
  const cssCodeBlock = document.getElementById('css-code-block');

  // Background blobs for organic ambient light
  const blob1 = document.getElementById('blob-1');
  const blob2 = document.getElementById('blob-2');
  const blob3 = document.getElementById('blob-3');
  const emotionBtns = document.querySelectorAll('.emotion-btn');

  // Widget elements
  const tempVal = document.getElementById('temp-val');
  const sliderThumb = document.getElementById('slider-thumb');
  const sliderFill = document.getElementById('slider-fill');
  const sliderTrack = document.getElementById('slider-track');
  const modeBtns = document.querySelectorAll('.widget-btn');
  const infoStatus = document.getElementById('info-status');
  const infoHumidity = document.getElementById('info-humidity');

  let currentTemp = 22;
  const minTemp = 16;
  const maxTemp = 30;

  // Custom CSS preview blocks for each of the 8 design languages
  const STYLES_CSS_CODE = {
    glassmorphism: `<span class="cmt">/* Glassmorphism: Transparency & Frosted Blur */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">rgba(255, 255, 255, 0.06)</span>;
  <span class="prop">backdrop-filter</span>: <span class="val">blur(20px)</span>;
  <span class="prop">border</span>: <span class="val">1px solid rgba(255, 255, 255, 0.12)</span>;
  <span class="prop">border-radius</span>: <span class="val">24px</span>;
  <span class="prop">box-shadow</span>: <span class="val">0 8px 32px rgba(0, 0, 0, 0.3)</span>;
}`,
    skeuomorphism: `<span class="cmt">/* Skeuomorphism: Realistic 3D & Gloss Bevels */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">linear-gradient(135deg, #2b2e35, #202228)</span>;
  <span class="prop">border</span>: <span class="val">2px solid #373b43</span>;
  <span class="prop">border-bottom</span>: <span class="val">3px solid #18191c</span>;
  <span class="prop">border-radius</span>: <span class="val">20px</span>;
  <span class="prop">box-shadow</span>: 
    <span class="val">0 15px 35px rgba(0,0,0,0.6)</span>,
    <span class="val">inset 0 1px 0 rgba(255, 255, 255, 0.1)</span>;
}`,
    claymorphism: `<span class="cmt">/* Claymorphism: Inner Shadows & Pill Corners */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#f0f3ff</span>;
  <span class="prop">border-radius</span>: <span class="val">32px</span>;
  <span class="prop">box-shadow</span>: 
    <span class="val">16px 16px 32px rgba(0, 5, 40, 0.08)</span>,
    <span class="val">inset -8px -8px 16px rgba(0, 5, 40, 0.04)</span>,
    <span class="val">inset 8px 8px 16px #ffffff</span>;
}`,
    neumorphism: `<span class="cmt">/* Neumorphism: Matte Extrusion & Dual Shadows */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#e0e0e0</span>;
  <span class="prop">border-radius</span>: <span class="val">30px</span>;
  <span class="prop">box-shadow</span>: 
    <span class="val">12px 12px 24px #bebebe</span>,
    <span class="val">-12px -12px 24px #ffffff</span>;
}`,
    flat: `<span class="cmt">/* Flat Design: Minimalist 2D & Zero Shadow */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#2d3748</span>;
  <span class="prop">border</span>: <span class="val">2px solid #4a5568</span>;
  <span class="prop">border-radius</span>: <span class="val">0px</span>;
  <span class="prop">box-shadow</span>: <span class="val">none</span>;
}`,
    material: `<span class="cmt">/* Material Design: elevation shadow layer */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#ffffff</span>;
  <span class="prop">border-radius</span>: <span class="val">12px</span>;
  <span class="prop">box-shadow</span>: 
    <span class="val">0 11px 15px -7px rgba(0,0,0,0.2)</span>, 
    <span class="val">0 24px 38px 3px rgba(0,0,0,0.14)</span>;
}`,
    'neo-brutalism': `<span class="cmt">/* Neo-Brutalism: Bold Black Shadows & Outline */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#ffffff</span>;
  <span class="prop">border</span>: <span class="val">4px solid #000000</span>;
  <span class="prop">border-radius</span>: <span class="val">0px</span>;
  <span class="prop">box-shadow</span>: <span class="val">8px 8px 0px #000000</span>;
}`,
    'aurora-ui': `<span class="cmt">/* Aurora UI: High backdrop filter blur */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">rgba(255, 255, 255, 0.015)</span>;
  <span class="prop">border</span>: <span class="val">1px solid rgba(255, 255, 255, 0.06)</span>;
  <span class="prop">backdrop-filter</span>: <span class="val">blur(40px)</span>;
  <span class="prop">box-shadow</span>: <span class="val">0 30px 60px rgba(0, 0, 0, 0.8)</span>;
}`,
    cyberpunk: `<span class="cmt">/* Cyberpunk: Neon HUD, Sharp Lines & Heavy Shadow */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#070716</span>;
  <span class="prop">border</span>: <span class="val">2px solid #00f0ff</span>;
  <span class="prop">border-radius</span>: <span class="val">0px</span>;
  <span class="prop">box-shadow</span>: 
    <span class="val">0 0 15px rgba(0, 240, 255, 0.2)</span>,
    <span class="val">inset 0 0 15px rgba(255, 0, 127, 0.15)</span>;
}`,
    bauhaus: `<span class="cmt">/* Bauhaus Minimal: Stark 2D, Pure Red/Blue/Yellow & Zero Radius */</span>
<span class="sel">.mockup-card</span> {
  <span class="prop">background</span>: <span class="val">#ffffff</span>;
  <span class="prop">border</span>: <span class="val">3px solid #000000</span>;
  <span class="prop">border-radius</span>: <span class="val">0px</span>;
  <span class="prop">box-shadow</span>: <span class="val">none</span>;
  <span class="prop">font-family</span>: <span class="val">"Grotesque", "Helvetica", sans-serif</span>;
}`
  };

  // ===== EMOTION MODE (Trend #8) =====
  const EMOTION_STYLES = {
    calm: {
      name: 'Calm',
      bodyBg: '#0a0d1a',
      contrast: 'reduced',
      saturation: 'reduced',
      brightness: 'soft'
    },
    energetic: {
      name: 'Energetic',
      bodyBg: '#0b0014',
      contrast: 'high',
      saturation: 'vibrant',
      brightness: 'bold'
    },
    focus: {
      name: 'Focus',
      bodyBg: '#06080f',
      contrast: 'crisp',
      saturation: 'mono',
      brightness: 'clear'
    }
  };

  emotionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      emotionBtns.forEach(b => {
        b.style.background = 'transparent';
        b.style.borderColor = 'rgba(255,255,255,0.06)';
        b.style.color = 'var(--text-muted)';
      });
      btn.style.background = 'rgba(139,92,246,0.1)';
      btn.style.borderColor = 'transparent';
      btn.style.color = '#fff';

      const emotion = btn.dataset.emotion;
      const style = EMOTION_STYLES[emotion];

      // Apply emotion data attribute to container
      container.setAttribute('data-emotion', emotion);

      // Apply emotion CSS variables to container
      const mockupCard = document.getElementById('mockup-card');

      // Remove existing emotion style tag
      const existingEmotionStyle = document.getElementById('emotion-style');
      if (existingEmotionStyle) existingEmotionStyle.remove();

      const emotionStyle = document.createElement('style');
      emotionStyle.id = 'emotion-style';

      if (emotion === 'calm') {
        mockupCard.style.filter = 'brightness(0.9) saturate(0.7)';
        document.body.style.backgroundColor = '#0a0d1a';
        emotionStyle.textContent = `
          .mockup-card { --emotion-hue: 220; --emotion-saturation: 40%; }
          .widget-btn { transition: all 0.6s ease; }
        `;
      } else if (emotion === 'energetic') {
        mockupCard.style.filter = 'brightness(1.1) saturate(1.3) contrast(1.1)';
        document.body.style.backgroundColor = '#0b0014';
        emotionStyle.textContent = `
          .mockup-card { --emotion-hue: 330; --emotion-saturation: 90%; }
          .climate-dial { animation: pulse-glow 2s ease infinite; }
        `;
      } else {
        mockupCard.style.filter = 'brightness(1) saturate(0.85) contrast(1.2)';
        document.body.style.backgroundColor = '#06080f';
        emotionStyle.textContent = `
          .mockup-card { --emotion-hue: 210; --emotion-saturation: 10%; }
          .widget-info-row { letter-spacing: 1px; }
        `;
      }
      document.head.appendChild(emotionStyle);

      // Update CSS code block to show emotion info
      const currentStyle = styleNameLabel.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const baseCode = STYLES_CSS_CODE[currentStyle] || STYLES_CSS_CODE['glassmorphism'];
      cssCodeBlock.innerHTML = baseCode + `\n\n<span class="cmt">/* 🧠 Emotion: ${style.name} */</span>\n<span class="cmt">/* Filter: ${mockupCard.style.filter} */</span>`;

      showNotification(`🧠 Emotion Mode: ${style.name}`);
    });
  });

  // Switch Design Styles
  styleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedStyle = tab.dataset.style;

      // Reset emotion filter when switching styles
      const mockupCard = document.getElementById('mockup-card');
      mockupCard.style.filter = '';

      // Update sidebar button states
      styleTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      // Update workspace container styling class
      container.className = `playground-container style-${selectedStyle}`;

      // Update label and CSS box
      styleNameLabel.textContent = tab.textContent.trim();
      cssCodeBlock.innerHTML = STYLES_CSS_CODE[selectedStyle];

      // Ambient Background transitions based on styles
      adjustAmbientBackground(selectedStyle);

      // Trigger dynamic toast
      showNotification(`Theme Swapped: ${tab.textContent.trim()}`);
    });
  });

  // Adjust Background blobs and organic grids depending on style selection
  function adjustAmbientBackground(style) {
    if (style === 'glassmorphism' || style === 'aurora-ui') {
      // Glow mesh fully active
      blob1.style.opacity = '1';
      blob2.style.opacity = '1';
      blob3.style.opacity = '1';
      blob1.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)';
      blob2.style.background = 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)';
      document.body.style.backgroundColor = '#0b0f19';
    } else if (style === 'cyberpunk') {
      // Neon glows active
      blob1.style.opacity = '0.8';
      blob2.style.opacity = '0.8';
      blob3.style.opacity = '0.5';
      blob1.style.background = 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, transparent 70%)';
      blob2.style.background = 'radial-gradient(circle, rgba(255, 0, 127, 0.4) 0%, transparent 70%)';
      document.body.style.backgroundColor = '#03030c';
    } else if (style === 'claymorphism') {
      blob1.style.opacity = '0';
      blob2.style.opacity = '0';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#cce3f5'; // light soft background matching clay
    } else if (style === 'neumorphism') {
      blob1.style.opacity = '0';
      blob2.style.opacity = '0';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#e0e0e0'; // uniform neumorphic gray canvas
    } else if (style === 'skeuomorphism') {
      blob1.style.opacity = '0.3';
      blob2.style.opacity = '0.3';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#16171b'; // rich dark dial metal body
    } else if (style === 'neo-brutalism') {
      blob1.style.opacity = '0';
      blob2.style.opacity = '0';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#fdf43f'; // loud brutalist yellow backdrop!
    } else if (style === 'bauhaus') {
      blob1.style.opacity = '0';
      blob2.style.opacity = '0';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#f5f5f5'; // Swiss off-white canvas
    } else {
      blob1.style.opacity = '0';
      blob2.style.opacity = '0.3';
      blob3.style.opacity = '0';
      document.body.style.backgroundColor = '#0b0f19';
    }
  }

  // ===== Climate Control Widget Drag logic =====
  let isDragging = false;

  function updateTemperatureFromX(clientX) {
    const rect = sliderTrack.getBoundingClientRect();
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.max(0, Math.min(1, percentage));

    // Calculate new temperature value
    const newTemp = Math.round(minTemp + percentage * (maxTemp - minTemp));
    currentTemp = newTemp;

    // Update interface representation
    tempVal.textContent = `${currentTemp}°C`;
    sliderThumb.style.left = `${percentage * 100}%`;
    sliderFill.style.width = `${percentage * 100}%`;

    // Set matching humidity indicator dynamically
    const correspondingHumidity = Math.round(75 - percentage * 30);
    infoHumidity.textContent = `${correspondingHumidity}%`;
  }

  // Mouse drag events
  sliderThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    updateTemperatureFromX(e.clientX);
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // Touch drag events (Mobile compatible)
  sliderThumb.addEventListener('touchstart', (e) => {
    isDragging = true;
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  });

  function onTouchMove(e) {
    if (!isDragging) return;
    updateTemperatureFromX(e.touches[0].clientX);
  }

  function onTouchEnd() {
    isDragging = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  }

  // Clicking slider track directly snaps handle
  sliderTrack.addEventListener('click', (e) => {
    if (e.target === sliderThumb) return;
    updateTemperatureFromX(e.clientX);
  });

  // Action Buttons presets
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.dataset.mode;
      if (preset === 'eco') {
        currentTemp = 19;
        infoStatus.textContent = 'ECO MODE ACTIVE';
      } else if (preset === 'comfort') {
        currentTemp = 23;
        infoStatus.textContent = 'COMFORT ACTIVE';
      } else {
        currentTemp = 27;
        infoStatus.textContent = 'BOOST ACTIVE';
      }

      // Sync temperature UI components
      tempVal.textContent = `${currentTemp}°C`;
      const ratio = (currentTemp - minTemp) / (maxTemp - minTemp);
      sliderThumb.style.left = `${ratio * 100}%`;
      sliderFill.style.width = `${ratio * 100}%`;
    });
  });

  // ===== Copy CSS button =====
  const copyBtn = document.getElementById('copy-css-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const rawCode = cssCodeBlock.textContent || cssCodeBlock.innerText;
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      }).catch(() => {
        copyBtn.textContent = '❌ Error';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // Initialize display
  styleTabs[0].click();

  // Dynamic Toast Notifications
  function showNotification(msg) {
    const existing = document.querySelector('.theme-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'theme-toast fixed bottom-6 right-6 bg-slate-900 border border-violet-500/30 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl z-50 transition-all';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.textContent = msg;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }
});
