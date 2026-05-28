// ===== CHROMA LAB — COLOR PALETTE STUDIO JS =====

document.addEventListener('DOMContentLoaded', () => {
  const baseColor = document.getElementById('base-color');
  const baseHex = document.getElementById('base-hex');
  const harmonySelect = document.getElementById('harmony-select');
  const sizeSelect = document.getElementById('size-select');
  const paletteGrid = document.getElementById('palette-grid');
  const cssExportCode = document.getElementById('css-export-code');
  const copyPaletteBtn = document.getElementById('copy-palette-btn');
  const exportBtn = document.getElementById('export-btn');
  const fgColor = document.getElementById('fg-color');
  const bgColor = document.getElementById('bg-color');
  const contrastRatio = document.getElementById('contrast-ratio');
  const contrastBadge = document.getElementById('contrast-badge');

  // ===== Color utilities =====
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = (n) => {
      const h = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return h.length === 1 ? '0' + h : h;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }

  function luminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function contrastRatioCalc(c1, c2) {
    const l1 = luminance(c1.r, c1.g, c1.b);
    const l2 = luminance(c2.r, c2.g, c2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ===== Harmony generators =====
  function generatePalette(hex, harmony, count) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];

    switch (harmony) {
      case 'monochromatic': {
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);
          const l = lerp(20, 85, t);
          const color = hslToRgb(hsl.h, hsl.s, l);
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      case 'complementary': {
        const compH = (hsl.h + 180) % 360;
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);
          const h = lerp(hsl.h, compH, t < 0.5 ? t * 2 : (t - 0.5) * 2);
          const s = lerp(hsl.s, hsl.s - 20, t);
          const l = lerp(Math.max(hsl.l - 15, 20), Math.min(hsl.l + 15, 80), t);
          const color = hslToRgb(h % 360, Math.max(s, 10), Math.max(l, 15));
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      case 'triadic': {
        const angles = [0, 120, 240];
        for (let i = 0; i < count; i++) {
          const idx = i % 3;
          const offset = Math.floor(i / 3) * 20;
          const h = (hsl.h + angles[idx] + offset) % 360;
          const s = Math.max(hsl.s - 10, 20);
          const l = lerp(30, 75, (i % 3) / 2);
          const color = hslToRgb(h, s, l);
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      case 'tetradic': {
        const angles = [0, 90, 180, 270];
        for (let i = 0; i < count; i++) {
          const idx = i % 4;
          const offset = Math.floor(i / 4) * 15;
          const h = (hsl.h + angles[idx] + offset) % 360;
          const s = Math.max(hsl.s - 15, 15);
          const l = lerp(25, 80, i / (count - 1));
          const color = hslToRgb(h, s, l);
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      case 'analogous': {
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);
          const h = (hsl.h - 30 + t * 60 + 360) % 360;
          const s = lerp(hsl.s - 20, hsl.s + 10, t);
          const l = lerp(hsl.l - 15, hsl.l + 15, t);
          const color = hslToRgb(h, Math.max(s, 15), Math.max(l, 20));
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      case 'split-complementary': {
        const angles = [0, 150, 210];
        for (let i = 0; i < count; i++) {
          const idx = i % 3;
          const offset = Math.floor(i / 3) * 25;
          const h = (hsl.h + angles[idx] + offset) % 360;
          const s = Math.max(hsl.s - 15, 20);
          const l = lerp(30, 75, i / (count - 1));
          const color = hslToRgb(h, s, l);
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
        break;
      }
      default: {
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1);
          const l = lerp(30, 80, t);
          const color = hslToRgb(hsl.h, hsl.s, l);
          colors.push(rgbToHex(color.r, color.g, color.b));
        }
      }
    }

    return colors.slice(0, count);
  }

  // ===== Color names =====
  const COLOR_NAMES = [
    'Primary', 'Secondary', 'Accent', 'Surface', 'Text',
    'Muted', 'Border', 'Highlight', 'Shadow', 'Subtle'
  ];

  // ===== Update palette =====
  function updatePalette() {
    const hex = baseColor.value;
    const harmony = harmonySelect.value;
    const count = parseInt(sizeSelect.value);
    const colors = generatePalette(hex, harmony, count);

    // Render swatches
    paletteGrid.innerHTML = '';
    colors.forEach((color, i) => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.style.background = color;

      const rgb = hexToRgb(color);
      const lum = luminance(rgb.r, rgb.g, rgb.b);
      if (lum > 0.5) swatch.classList.add('swatch-dark');

      swatch.innerHTML = `
        <span class="swatch-hex">${color.toUpperCase()}</span>
        <span class="swatch-name">${COLOR_NAMES[i % COLOR_NAMES.length]} ${i + 1}</span>
      `;
      paletteGrid.appendChild(swatch);
    });

    // Update CSS export
    updateCSSExport(hex, colors);

    // Update BG contrast picker
    bgColor.value = colors[0] || hex;
  }

  // ===== Update CSS export =====
  function updateCSSExport(baseHex, colors) {
    let css = `:root {\n`;
    css += `  /* Base: ${baseHex.toUpperCase()} — ${harmonySelect.options[harmonySelect.selectedIndex].text} */\n\n`;
    colors.forEach((color, i) => {
      const name = COLOR_NAMES[i % COLOR_NAMES.length].toLowerCase().replace(/\s+/g, '-');
      css += `  --color-${name}-${i + 1}: ${color};\n`;
    });
    css += `\n  /* Usage example */\n`;
    css += `  --color-primary: ${colors[0]};\n`;
    css += `  --color-secondary: ${colors[1] || colors[0]};\n`;
    css += `  --color-accent: ${colors[Math.min(2, colors.length - 1)]};\n`;
    css += `}`;

    cssExportCode.innerHTML = css
      .replace(/(--[\w-]+):/g, '<span class="prop">$1</span>:')
      .replace(/(#[0-9a-fA-F]+)/g, '<span class="val">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cmt">$1</span>');
  }

  // ===== Update contrast =====
  function updateContrast() {
    const fg = hexToRgb(fgColor.value);
    const bg = hexToRgb(bgColor.value);
    const ratio = contrastRatioCalc(fg, bg);

    contrastRatio.textContent = `${ratio.toFixed(2)}:1`;

    if (ratio >= 7) {
      contrastBadge.textContent = 'AAA ✓';
      contrastBadge.className = 'contrast-badge aaa';
    } else if (ratio >= 4.5) {
      contrastBadge.textContent = 'AA ✓';
      contrastBadge.className = 'contrast-badge aa';
    } else if (ratio >= 3) {
      contrastBadge.textContent = 'AA (Large)';
      contrastBadge.className = 'contrast-badge aa';
    } else {
      contrastBadge.textContent = 'FAIL ✗';
      contrastBadge.className = 'contrast-badge fail';
    }
  }

  // ===== Event listeners =====
  baseColor.addEventListener('input', () => {
    baseHex.value = baseColor.value;
    updatePalette();
    updateContrast();
  });

  baseHex.addEventListener('input', () => {
    const val = baseHex.value;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      baseColor.value = val;
      updatePalette();
      updateContrast();
    }
  });

  harmonySelect.addEventListener('change', updatePalette);
  sizeSelect.addEventListener('change', updatePalette);
  fgColor.addEventListener('input', updateContrast);
  bgColor.addEventListener('input', updateContrast);

  // ===== Export CSS to clipboard =====
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rawCSS = cssExportCode.textContent || cssExportCode.innerText;
      // Clean up HTML tags
      const cleanCSS = rawCSS.replace(/<[^>]*>/g, '');
      navigator.clipboard.writeText(cleanCSS).then(() => {
        exportBtn.textContent = '✅ Copied CSS Variables!';
        setTimeout(() => { exportBtn.textContent = '📋 Export CSS Variables'; }, 2500);
      });
    });
  }

  if (copyPaletteBtn) {
    copyPaletteBtn.addEventListener('click', () => {
      const rawCSS = cssExportCode.textContent || cssExportCode.innerText;
      const cleanCSS = rawCSS.replace(/<[^>]*>/g, '');
      navigator.clipboard.writeText(cleanCSS).then(() => {
        copyPaletteBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyPaletteBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // ===== Initialize =====
  updatePalette();
  updateContrast();
});
