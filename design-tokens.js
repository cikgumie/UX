// ===== DESIGN TOKENS HUB — JAVASCRIPT SCALING ENGINES =====

document.addEventListener('DOMContentLoaded', () => {
  const mockup = document.getElementById('token-mockup-card');
  const codeBlock = document.getElementById('code-block');
  const copyBtn = document.getElementById('copy-tokens-btn');
  const formatLabel = document.getElementById('format-label');
  const codeTabs = document.querySelectorAll('.code-tab');

  // Input refs
  const spaceBase = document.getElementById('space-base');
  const spaceBaseLabel = document.getElementById('space-base-label');
  const spaceScaleSelect = document.getElementById('space-scale-select');
  const spaceScaleLabel = document.getElementById('space-scale-label');

  const fontBase = document.getElementById('font-base');
  const fontBaseLabel = document.getElementById('font-base-label');
  const fontScaleSelect = document.getElementById('font-scale-select');
  const fontScaleLabel = document.getElementById('font-scale-label');

  const primaryColor = document.getElementById('primary-color');
  const primaryHex = document.getElementById('primary-hex');
  const accentColor = document.getElementById('accent-color');
  const accentHex = document.getElementById('accent-hex');

  const radiusBase = document.getElementById('radius-base');
  const radiusBaseLabel = document.getElementById('radius-base-label');

  let activeFormat = 'css';

  // ===== Spacing scale generator =====
  function generateSpacing(base, scale) {
    const spacing = [];
    if (scale === 'linear') {
      for (let i = 1; i <= 5; i++) {
        spacing.push(base * i);
      }
    } else if (scale === 'fibonacci') {
      const fib = [1, 2, 3, 5, 8];
      fib.forEach(f => spacing.push(base * f));
    } else {
      const multiplier = parseFloat(scale);
      for (let i = 0; i < 5; i++) {
        spacing.push(Math.round(base * Math.pow(multiplier, i)));
      }
    }
    return spacing;
  }

  // ===== Typography scale generator =====
  function generateTypography(base, multiplier) {
    return {
      sm: Math.round((base / multiplier) * 10) / 10,
      base: base,
      lg: Math.round(base * multiplier * 10) / 10,
      xl: Math.round(base * Math.pow(multiplier, 2) * 10) / 10,
      xxl: Math.round(base * Math.pow(multiplier, 3) * 10) / 10
    };
  }

  // ===== Dynamic variable binder =====
  function update() {
    const sBase = parseInt(spaceBase.value);
    const sScale = spaceScaleSelect.value;
    const spacing = generateSpacing(sBase, sScale);

    const fBase = parseInt(fontBase.value);
    const fScale = parseFloat(fontScaleSelect.value);
    const typography = generateTypography(fBase, fScale);

    const pri = primaryColor.value;
    const acc = accentColor.value;
    const rad = parseInt(radiusBase.value);

    // Sync labels
    spaceBaseLabel.textContent = `${sBase}px`;
    spaceScaleLabel.textContent = spaceScaleSelect.options[spaceScaleSelect.selectedIndex].text.split(' ')[0];
    fontBaseLabel.textContent = `${fBase}px`;
    fontScaleLabel.textContent = fScale.toFixed(3);
    radiusBaseLabel.textContent = `${rad}px`;

    // Apply tokens directly to Mockup Widget Stage
    mockup.style.setProperty('--primary-token', pri);
    mockup.style.setProperty('--accent-token', acc);
    mockup.style.setProperty('--radius-token', `${rad}px`);

    // Spacing
    spacing.forEach((val, i) => {
      mockup.style.setProperty(`--space-${i + 1}`, `${val}px`);
    });

    // Font Sizes
    mockup.style.setProperty('--font-sm', `${typography.sm}px`);
    mockup.style.setProperty('--font-base', `${typography.base}px`);
    mockup.style.setProperty('--font-lg', `${typography.lg}px`);
    mockup.style.setProperty('--font-xl', `${typography.xl}px`);
    mockup.style.setProperty('--font-2xl', `${typography.xxl}px`);

    updateCode(pri, acc, sBase, sScale, spacing, fBase, fScale, typography, rad);
  }

  // ===== Exporter Output Formatting =====
  function updateCode(pri, acc, sBase, sScale, spacing, fBase, fScale, typography, rad) {
    if (activeFormat === 'css') {
      formatLabel.textContent = 'CSS Variables';
      codeBlock.innerHTML = `<span class="cmt">/* Design Tokens — CSS Custom Properties */</span>\n`
        + `<span class="prop">:root</span> {\n`
        + `  <span class="prop">--primary-brand</span>: <span class="val">${pri}</span>;\n`
        + `  <span class="prop">--accent-highlight</span>: <span class="val">${acc}</span>;\n\n`
        + `  <span class="cmt">/* Spacing Scale (Base: ${sBase}px, Scale: ${sScale}) */</span>\n`
        + `  <span class="prop">--space-base</span>: <span class="val">${sBase}px</span>;\n`
        + spacing.map((val, i) => `  <span class="prop">--space-${i + 1}</span>: <span class="val">${val}px</span>;`).join('\n') + `\n\n`
        + `  <span class="cmt">/* Modular Type Scale (Base: ${fBase}px, Scale: ${fScale}) */</span>\n`
        + `  <span class="prop">--font-size-sm</span>: <span class="val">${typography.sm}px</span>;\n`
        + `  <span class="prop">--font-size-base</span>: <span class="val">${typography.base}px</span>;\n`
        + `  <span class="prop">--font-size-lg</span>: <span class="val">${typography.lg}px</span>;\n`
        + `  <span class="prop">--font-size-xl</span>: <span class="val">${typography.xl}px</span>;\n`
        + `  <span class="prop">--font-size-2xl</span>: <span class="val">${typography.xxl}px</span>;\n\n`
        + `  <span class="cmt">/* Borders */</span>\n`
        + `  <span class="prop">--radius-base</span>: <span class="val">${rad}px</span>;\n`
        + `}`;
    } else {
      formatLabel.textContent = 'Tailwind JSON';
      const tailwindJSON = `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "${pri}",
        accent: "${acc}",
      },
      spacing: {
        "base": "${sBase}px",
${spacing.map((val, i) => `        "${i + 1}": "${val}px",`).join('\n')}
      },
      fontSize: {
        "sm": "${typography.sm}px",
        "base": "${typography.base}px",
        "lg": "${typography.lg}px",
        "xl": "${typography.xl}px",
        "2xl": "${typography.xxl}px",
      },
      borderRadius: {
        "base": "${rad}px",
      }
    }
  }
}`;
      codeBlock.innerHTML = `<span class="cmt">// design-tokens.config.js</span>\n`
        + tailwindJSON
          .replace(/(theme|extend|colors|spacing|fontSize|borderRadius):/g, '<span class="prop">$1</span>:')
          .replace(/(".*?")/g, '<span class="val">$1</span>')
          .replace(/(module\.exports)/g, '<span class="kw">$1</span>');
    }
  }

  // ===== Sync Hex Text Inputs with Pickers =====
  function setupColorSync(picker, hexInput) {
    picker.addEventListener('input', () => {
      hexInput.value = picker.value.toUpperCase();
      update();
    });
    hexInput.addEventListener('input', () => {
      const val = hexInput.value;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        picker.value = val;
        update();
      }
    });
  }

  setupColorSync(primaryColor, primaryHex);
  setupColorSync(accentColor, accentHex);

  // ===== Sliders & Dropdowns Listeners =====
  [spaceBase, spaceScaleSelect, fontBase, fontScaleSelect, radiusBase].forEach(input => {
    input.addEventListener('input', update);
    input.addEventListener('change', update);
  });

  // ===== Code Tab Switching =====
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFormat = tab.dataset.format;
      update();
    });
  });

  // ===== Copy Clipboard Action =====
  copyBtn.addEventListener('click', () => {
    const raw = codeBlock.textContent || codeBlock.innerText;
    const clean = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    navigator.clipboard.writeText(clean).then(() => {
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => { copyBtn.textContent = '📋 Copy Code'; }, 2000);
    });
  });

  // ===== Initialize =====
  update();
});
