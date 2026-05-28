// ===== SHADOWCRAFT — BOX SHADOW & FILTER STUDIO JS =====

document.addEventListener('DOMContentLoaded', () => {
  const shape = document.getElementById('sc-shape');
  const backdropBox = document.getElementById('backdrop-box');
  const codeBlock = document.getElementById('code-block');
  const backdropCode = document.getElementById('backdrop-code-block');
  const copyShadowBtn = document.getElementById('copy-shadow-btn');
  const copyBackdropBtn = document.getElementById('copy-backdrop-btn');
  const presetBtns = document.querySelectorAll('.preset-btn');

  // Layer 1 refs
  const l1 = {
    ox: document.getElementById('ox1'), oy: document.getElementById('oy1'),
    blur: document.getElementById('blur1'), spread: document.getElementById('spread1'),
    color: document.getElementById('color1'), hex: document.getElementById('color1-hex'),
    opacity: document.getElementById('opacity1'), inset: document.getElementById('inset1'),
    oxV: document.getElementById('ox1-val'), oyV: document.getElementById('oy1-val'),
    blurV: document.getElementById('blur1-val'), spreadV: document.getElementById('spread1-val'),
    opacityV: document.getElementById('opacity1-val')
  };

  // Layer 2 refs
  const l2 = {
    ox: document.getElementById('ox2'), oy: document.getElementById('oy2'),
    blur: document.getElementById('blur2'), spread: document.getElementById('spread2'),
    color: document.getElementById('color2'), hex: document.getElementById('color2-hex'),
    opacity: document.getElementById('opacity2'), inset: document.getElementById('inset2'),
    oxV: document.getElementById('ox2-val'), oyV: document.getElementById('oy2-val'),
    blurV: document.getElementById('blur2-val'), spreadV: document.getElementById('spread2-val'),
    opacityV: document.getElementById('opacity2-val')
  };

  // Layer 3 refs
  const l3 = {
    ox: document.getElementById('ox3'), oy: document.getElementById('oy3'),
    blur: document.getElementById('blur3'), spread: null,
    color: document.getElementById('color3'), hex: document.getElementById('color3-hex'),
    opacity: document.getElementById('opacity3'), inset: null,
    oxV: document.getElementById('ox3-val'), oyV: document.getElementById('oy3-val'),
    blurV: document.getElementById('blur3-val'), spreadV: null,
    opacityV: document.getElementById('opacity3-val')
  };

  // Backdrop refs
  const bd = {
    blur: document.getElementById('bd-blur'), blurV: document.getElementById('bd-blur-val'),
    bright: document.getElementById('bd-bright'), brightV: document.getElementById('bd-bright-val'),
    contrast: document.getElementById('bd-contrast'), contrastV: document.getElementById('bd-contrast-val')
  };

  // ===== Presets =====
  const PRESETS = {
    soft: {
      ox1: 0, oy1: 4, blur1: 12, spread1: 0, color1: '#000000', opacity1: 15, inset1: false,
      ox2: 0, oy2: -1, blur2: 4, spread2: 0, color2: '#000000', opacity2: 8, inset2: false,
      ox3: 0, oy3: 0, blur3: 0, color3: '#000000', opacity3: 0
    },
    medium: {
      ox1: 4, oy1: 8, blur1: 20, spread1: 0, color1: '#1a1730', opacity1: 25, inset1: false,
      ox2: -2, oy2: -2, blur2: 8, spread2: 0, color2: '#8b5cf6', opacity2: 12, inset2: false,
      ox3: 0, oy3: 0, blur3: 0, color3: '#000000', opacity3: 0
    },
    hard: {
      ox1: 8, oy1: 8, blur1: 0, spread1: 0, color1: '#000000', opacity1: 40, inset1: false,
      ox2: -3, oy2: -3, blur2: 0, spread2: 0, color2: '#ffffff', opacity2: 10, inset2: false,
      ox3: 0, oy3: 0, blur3: 0, color3: '#000000', opacity3: 0
    },
    glow: {
      ox1: 0, oy1: 0, blur1: 30, spread1: 0, color1: '#8b5cf6', opacity1: 60, inset1: false,
      ox2: 0, oy2: 0, blur2: 60, spread2: 0, color2: '#ec4899', opacity2: 30, inset2: false,
      ox3: 0, oy3: 0, blur3: 90, color3: '#8b5cf6', opacity3: 15
    },
    inset: {
      ox1: 0, oy1: 4, blur1: 12, spread1: 0, color1: '#000000', opacity1: 30, inset1: true,
      ox2: 0, oy2: -2, blur2: 6, spread2: 0, color2: '#ffffff', opacity2: 15, inset2: true,
      ox3: 0, oy3: 0, blur3: 0, color3: '#000000', opacity3: 0
    },
    neon: {
      ox1: 0, oy1: 0, blur1: 15, spread1: 0, color1: '#06b6d4', opacity1: 70, inset1: false,
      ox2: 0, oy2: 0, blur2: 35, spread2: 0, color2: '#06b6d4', opacity2: 40, inset2: false,
      ox3: 0, oy3: 0, blur3: 70, color3: '#22d3ee', opacity3: 20
    }
  };

  // ===== Build shadow string =====
  function buildShadow(layer, isInset) {
    const ox = layer.ox.value;
    const oy = layer.oy.value;
    const blur = layer.blur.value;
    const spread = layer.spread ? layer.spread.value : '0';
    const hex = layer.color.value;
    const op = (layer.opacity.value / 100).toFixed(2);
    const inset = isInset && isInset.checked ? 'inset ' : '';
    return `${inset}${ox}px ${oy}px ${blur}px ${spread}px ${hex}${op < 1 ? hexToRgba(hex, op) : ''}`;
  }

  function hexToRgba(hex, opacity) {
    // If opacity is 1, return hex as-is
    if (parseFloat(opacity) >= 1) return hex;
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  // ===== Update everything =====
  function update() {
    // Update display values
    updateDisplay(l1); updateDisplay(l2); updateDisplay(l3);
    updateBackdropDisplay();

    // Build shadow declarations
    const shadows = [];
    const s1 = buildShadow(l1, l1.inset);
    const s2 = buildShadow(l2, l2.inset);
    const s3 = buildShadow(l3, null);

    if (l1.opacity.value > 0) shadows.push(s1);
    if (l2.opacity.value > 0) shadows.push(s2);
    if (l3.opacity.value > 0 && l3.blur.value > 0) shadows.push(s3);

    const shadowStr = shadows.join(',\n       ');
    
    // Apply to shape
    if (shadowStr) {
      shape.style.boxShadow = shadowStr;
    } else {
      shape.style.boxShadow = 'none';
    }
    shape.style.borderRadius = '24px';

    // Update backdrop
    const blur = bd.blur.value;
    const bright = bd.bright.value;
    const contrast = bd.contrast.value;
    backdropBox.style.backdropFilter = `blur(${blur}px) brightness(${bright}%) contrast(${contrast}%)`;
    backdropBox.textContent = `blur(${blur}px)`;

    // Update code blocks
    updateCode(shadows);
    updateBackdropCode(blur, bright, contrast);
  }

  function updateDisplay(layer) {
    if (layer.oxV) layer.oxV.textContent = layer.ox.value;
    if (layer.oyV) layer.oyV.textContent = layer.oy.value;
    if (layer.blurV) layer.blurV.textContent = layer.blur.value;
    if (layer.spreadV) layer.spreadV.textContent = layer.spread ? layer.spread.value : '0';
    if (layer.opacityV) layer.opacityV.textContent = (layer.opacity.value / 100).toFixed(2);
    if (layer.hex) layer.hex.value = layer.color.value;
  }

  function updateBackdropDisplay() {
    bd.blurV.textContent = `${bd.blur.value}px`;
    bd.brightV.textContent = `${bd.bright.value}%`;
    bd.contrastV.textContent = `${bd.contrast.value}%`;
  }

  function updateCode(shadows) {
    if (shadows.length === 0) {
      codeBlock.innerHTML = '<span class="cmt">/* No shadows active */</span>';
      return;
    }
    codeBlock.innerHTML = `<span class="cmt">/* box-shadow: multi-layer */</span>\n`
      + `<span class="prop">box-shadow</span>:\n`
      + `  ${shadows.join(',\n  ')};`;
  }

  function updateBackdropCode(blur, bright, contrast) {
    backdropCode.innerHTML = `<span class="cmt">/* backdrop-filter */</span>\n`
      + `<span class="prop">backdrop-filter</span>: <span class="val">blur(${blur}px)</span>\n`
      + `  <span class="val">brightness(${bright}%)</span>\n`
      + `  <span class="val">contrast(${contrast}%)</span>;`;
  }

  // ===== Apply preset =====
  function applyPreset(name) {
    const p = PRESETS[name];
    if (!p) return;

    l1.ox.value = p.ox1; l1.oy.value = p.oy1;
    l1.blur.value = p.blur1; l1.spread.value = p.spread1;
    l1.color.value = p.color1; l1.hex.value = p.color1;
    l1.opacity.value = p.opacity1; l1.inset.checked = p.inset1;

    l2.ox.value = p.ox2; l2.oy.value = p.oy2;
    l2.blur.value = p.blur2; l2.spread.value = p.spread2;
    l2.color.value = p.color2; l2.hex.value = p.color2;
    l2.opacity.value = p.opacity2; l2.inset.checked = p.inset2;

    l3.ox.value = p.ox3; l3.oy.value = p.oy3;
    l3.blur.value = p.blur3;
    l3.color.value = p.color3; l3.hex.value = p.color3;
    l3.opacity.value = p.opacity3;

    update();
  }

  // ===== Event listeners =====
  const allInputs = [
    l1.ox, l1.oy, l1.blur, l1.spread, l1.color, l1.opacity, l1.inset,
    l2.ox, l2.oy, l2.blur, l2.spread, l2.color, l2.opacity, l2.inset,
    l3.ox, l3.oy, l3.blur, l3.color, l3.opacity,
    bd.blur, bd.bright, bd.contrast
  ];

  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      update();
    });
    input.addEventListener('change', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      update();
    });
    if (input.type === 'checkbox') {
      input.addEventListener('change', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        update();
      });
    }
  });

  // Hex inputs sync
  [l1, l2, l3].forEach(layer => {
    if (layer.hex) {
      layer.hex.addEventListener('input', () => {
        const val = layer.hex.value;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          layer.color.value = val;
          presetBtns.forEach(b => b.classList.remove('active'));
          update();
        }
      });
      layer.color.addEventListener('input', () => {
        layer.hex.value = layer.color.value;
        presetBtns.forEach(b => b.classList.remove('active'));
        update();
      });
    }
  });

  // Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreset(btn.dataset.preset);
    });
  });

  // Copy buttons
  if (copyShadowBtn) {
    copyShadowBtn.addEventListener('click', () => {
      const raw = codeBlock.textContent || codeBlock.innerText;
      navigator.clipboard.writeText(raw).then(() => {
        copyShadowBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyShadowBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  if (copyBackdropBtn) {
    copyBackdropBtn.addEventListener('click', () => {
      const raw = backdropCode.textContent || backdropCode.innerText;
      navigator.clipboard.writeText(raw).then(() => {
        copyBackdropBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBackdropBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // ===== Initialize with soft preset =====
  applyPreset('soft');
  presetBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.preset === 'soft');
  });
});
