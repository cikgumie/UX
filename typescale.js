// ===== TYPESCALE — TYPOGRAPHY SCALE TOOL JS =====

document.addEventListener('DOMContentLoaded', () => {
  const ratioSelect = document.getElementById('ratio-select');
  const baseSlider = document.getElementById('base-slider');
  const baseVal = document.getElementById('base-val');
  const stepsSlider = document.getElementById('steps-slider');
  const stepsVal = document.getElementById('steps-val');
  const fontSelect = document.getElementById('font-select');
  const previewText = document.getElementById('preview-text');
  const scaleDisplay = document.getElementById('ts-scale-display');
  const codeBlock = document.getElementById('code-block');
  const copyCssBtn = document.getElementById('copy-css-btn');
  const copyClampBtn = document.getElementById('copy-clamp-btn');
  const toggleHeadingsBtn = document.getElementById('toggle-headings-btn');

  let showHeadings = true;

  // Font pairing configs
  const FONTS = {
    'inter-outfit': { heading: "'Outfit', sans-serif", body: "'Inter', sans-serif" },
    'inter-playfair': { heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
    'space-inter': { heading: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
    'outfit-playfair': { heading: "'Outfit', sans-serif", body: "'Playfair Display', serif" }
  };

  // Level config
  const LEVELS = [
    { id: 'h1', label: 'H1', steps: 5, tag: 'h1' },
    { id: 'h2', label: 'H2', steps: 4, tag: 'h2' },
    { id: 'h3', label: 'H3', steps: 3, tag: 'h3' },
    { id: 'h4', label: 'H4', steps: 2, tag: 'h4' },
    { id: 'body', label: 'Body', steps: 0, tag: 'p' },
    { id: 'small', label: 'Small', steps: -1, tag: 'small' },
    { id: 'micro', label: 'Micro', steps: -2, tag: 'small' }
  ];

  // ===== Calculate scale =====
  function calculateScale(ratio, base, steps) {
    const sizes = [];
    // Generate from -2 to +5
    for (let i = -2; i <= steps; i++) {
      const size = base * Math.pow(ratio, i);
      sizes.push(size);
    }
    return sizes;
  }

  // ===== Generate clamp value =====
  function generateClamp(minSize, maxSize) {
    const min = Math.min(minSize, maxSize);
    const max = Math.max(minSize, maxSize);
    const slope = (max - min) / 100;
    const intercept = min - slope * 320;
    return `clamp(${min.toFixed(1)}px, ${slope.toFixed(4)} * 100vw + ${intercept.toFixed(1)}px, ${max.toFixed(1)}px)`;
  }

  // ===== Update display =====
  function updateScale() {
    const ratio = parseFloat(ratioSelect.value);
    const base = parseFloat(baseSlider.value);
    const steps = parseInt(stepsSlider.value);
    const fontKey = fontSelect.value;
    const fonts = FONTS[fontKey];
    const text = previewText.value || 'The quick brown fox jumps over the lazy dog';

    const sizes = calculateScale(ratio, base, steps);

    // Get all scale items
    const items = scaleDisplay.querySelectorAll('.scale-item');
    
    items.forEach((item, index) => {
      const level = LEVELS[index];
      if (!level) return;

      const sizeIdx = level.steps + 2; // offset for -2 base
      const size = sizes[sizeIdx] || base;

      // Min/max for clamp
      const minSize = size * 0.85; // 85% at mobile
      const maxSize = size * 1.0;  // 100% at desktop
      const clampVal = generateClamp(minSize, maxSize);

      const textEl = item.querySelector('.scale-text');
      const sizeEl = item.querySelector('.scale-size');

      // Apply font and size
      if (level.steps > 0) {
        textEl.style.fontFamily = fonts.heading;
        textEl.style.fontWeight = '700';
      } else {
        textEl.style.fontFamily = fonts.body;
        textEl.style.fontWeight = '400';
      }
      
      textEl.style.fontSize = clampVal;
      textEl.textContent = level.steps > 0 ? text.charAt(0).toUpperCase() + text.slice(1).split(' ').slice(0, 3).join(' ') : text;

      // Size label
      sizeEl.textContent = `${size.toFixed(1)}px → clamp(…)`;

      // Toggle headings visibility
      if (level.steps > 0 && !showHeadings) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
      }
    });

    // Update CSS code
    updateCSS(sizes, base, ratio, fonts, steps);
  }

  // ===== Update CSS code =====
  function updateCSS(sizes, base, ratio, fonts, steps) {
    let css = `/* Type Scale: ${ratioSelect.options[ratioSelect.selectedIndex].text} */\n`;
    css += `/* Base: ${base}px · Steps: ${steps} */\n\n`;

    css += `:root {\n`;
    css += `  --font-heading: ${fonts.heading};\n`;
    css += `  --font-body: ${fonts.body};\n\n`;

    LEVELS.forEach((level, index) => {
      const sizeIdx = level.steps + 2;
      const size = sizes[sizeIdx] || base;
      const minSize = size * 0.85;
      const maxSize = size * 1.0;
      const clampVal = generateClamp(minSize, maxSize);

      const varName = `--fs-${level.id}`;
      css += `  ${varName}: ${clampVal};\n`;
    });

    css += `}\n\n`;

    // Usage examples
    LEVELS.forEach((level) => {
      if (level.steps > 0) {
        css += `${level.tag} { font-size: var(--fs-${level.id}); font-family: var(--font-heading); }\n`;
      } else if (level.id === 'body') {
        css += `body { font-size: var(--fs-${level.id}); font-family: var(--font-body); }\n`;
      }
    });

    // Syntax highlight
    codeBlock.innerHTML = css
      .replace(/(--[\w-]+):/g, '<span class="prop">$1</span>:')
      .replace(/(clamp\([^)]+\))/g, '<span class="val">$1</span>')
      .replace(/(\d+\.?\d*px)/g, '<span class="num">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cmt">$1</span>')
      .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>');
  }

  // ===== Copy functions =====
  function copyToClipboard(text, btn, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✅ Copied!';
      setTimeout(() => { btn.textContent = successMsg || '📋 Copy'; }, 2000);
    });
  }

  // ===== Event listeners =====
  ratioSelect.addEventListener('change', updateScale);
  baseSlider.addEventListener('input', () => {
    baseVal.textContent = `${parseFloat(baseSlider.value).toFixed(1)}px`;
    updateScale();
  });
  stepsSlider.addEventListener('input', () => {
    stepsVal.textContent = stepsSlider.value;
    updateScale();
  });
  fontSelect.addEventListener('change', updateScale);
  previewText.addEventListener('input', updateScale);

  toggleHeadingsBtn.addEventListener('click', () => {
    showHeadings = !showHeadings;
    toggleHeadingsBtn.textContent = showHeadings ? 'Hide Headings' : 'Show Headings';
    updateScale();
  });

  if (copyCssBtn) {
    copyCssBtn.addEventListener('click', () => {
      const raw = codeBlock.textContent || codeBlock.innerText;
      copyToClipboard(raw, copyCssBtn, '📋 Copy CSS');
    });
  }

  if (copyClampBtn) {
    copyClampBtn.addEventListener('click', () => {
      // Generate just clamp CSS
      const ratio = parseFloat(ratioSelect.value);
      const base = parseFloat(baseSlider.value);
      const steps = parseInt(stepsSlider.value);
      const sizes = calculateScale(ratio, base, steps);

      let css = `/* Clamp Scale — ${ratioSelect.options[ratioSelect.selectedIndex].text} */\n\n`;
      LEVELS.forEach((level) => {
        const sizeIdx = level.steps + 2;
        const size = sizes[sizeIdx] || base;
        const minSize = size * 0.85;
        const maxSize = size * 1.0;
        const clampVal = generateClamp(minSize, maxSize);
        css += `--fs-${level.id}: ${clampVal};\n`;
      });
      
      copyToClipboard(css, copyClampBtn, '📋 Copy clamp()');
    });
  }

  // ===== Initialize =====
  baseVal.textContent = `${baseSlider.value}px`;
  stepsVal.textContent = stepsSlider.value;
  toggleHeadingsBtn.textContent = 'Hide Headings';
  updateScale();
});
