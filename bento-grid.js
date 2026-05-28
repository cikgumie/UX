// ===== BENTO GRID INTERACTIVE DEMO — JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('resize-container');
  const bentoGrid = document.getElementById('bento-grid');
  const handle = document.getElementById('resize-handle');
  const widthDisplay = document.getElementById('width-display');
  const widthFill = document.getElementById('width-bar-fill');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cssTabs = document.querySelectorAll('.css-tab');
  const cssCode = document.getElementById('css-code');

  // Breakpoint presets
  const PRESETS = {
    mobile: 380,
    tablet: 620,
    laptop: 860,
    desktop: 1100
  };

  const BREAKPOINTS = {
    mobile: 0,
    tablet: 480,
    laptop: 768,
    desktop: 1024
  };

  const MAX_WIDTH = 1150;
  const MIN_WIDTH = 320;

  // CSS code blocks for each breakpoint
  const CSS_CODE = {
    base: `<span class="cmt">/* Base: single column stack */</span>
<span class="prop">.bento</span> {
  <span class="kw">display</span>: <span class="val">grid</span>;
  <span class="kw">gap</span>: <span class="val">14px</span>;
  <span class="kw">grid-template-columns</span>: <span class="val">1fr</span>;
  <span class="kw">grid-template-areas</span>:
    <span class="str">'stats'</span>
    <span class="str">'about'</span>
    <span class="str">'hero'</span>
    <span class="str">'media'</span>
    <span class="str">'feat'</span>
    <span class="str">'feed'</span>
    <span class="str">'card'</span>
    <span class="str">'promo'</span>
    <span class="str">'tasks'</span>;
}`,
    tablet: `<span class="cmt">/* 480px+ two-col layout */</span>
<span class="kw">@media</span> (<span class="prop">min-width</span>: <span class="val">480px</span>) {
  <span class="prop">.bento</span> {
    <span class="kw">grid-template-columns</span>:
      <span class="val">repeat(2, 1fr)</span>;
    <span class="kw">grid-template-areas</span>:
      <span class="str">'stats  about'</span>
      <span class="str">'hero   hero'</span>
      <span class="str">'media  feat'</span>
      <span class="str">'feed   card'</span>
      <span class="str">'promo  tasks'</span>;
  }
}`,
    laptop: `<span class="cmt">/* 768px+ three-col layout */</span>
<span class="kw">@media</span> (<span class="prop">min-width</span>: <span class="val">768px</span>) {
  <span class="prop">.bento</span> {
    <span class="kw">grid-template-columns</span>:
      <span class="val">repeat(3, 1fr)</span>;
    <span class="kw">grid-template-rows</span>:
      <span class="val">repeat(4, 1fr)</span>;
    <span class="kw">grid-template-areas</span>:
      <span class="str">'stats  about hero'</span>
      <span class="str">'media  feat  hero'</span>
      <span class="str">'feed   feat  card'</span>
      <span class="str">'promo  promo tasks'</span>;
  }
}`,
    desktop: `<span class="cmt">/* 1024px+ four-col layout */</span>
<span class="kw">@media</span> (<span class="prop">min-width</span>: <span class="val">1024px</span>) {
  <span class="prop">.bento</span> {
    <span class="kw">grid-template-columns</span>:
      <span class="val">repeat(4, 1fr)</span>;
    <span class="kw">grid-template-rows</span>:
      <span class="val">repeat(4, 1fr)</span>;
    <span class="kw">grid-template-areas</span>:
      <span class="str">'stats  about hero  hero'</span>
      <span class="str">'media  feat  hero  hero'</span>
      <span class="str">'feed   feat  card  card'</span>
      <span class="str">'promo  promo tasks tasks'</span>;
  }
}`
  };

  // ===== Update grid layout based on container width =====
  function getBreakpoint(width) {
    if (width >= BREAKPOINTS.desktop) return 'desktop';
    if (width >= BREAKPOINTS.laptop) return 'laptop';
    if (width >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  }

  function updateLayout() {
    const width = container.offsetWidth;
    const bp = getBreakpoint(width);

    // Update grid classes
    bentoGrid.classList.remove('layout-tablet', 'layout-laptop', 'layout-desktop');
    if (bp === 'tablet') bentoGrid.classList.add('layout-tablet');
    if (bp === 'laptop') bentoGrid.classList.add('layout-laptop');
    if (bp === 'desktop') bentoGrid.classList.add('layout-desktop');

    // Update width display
    widthDisplay.textContent = `${width}px`;

    // Update progress bar
    const pct = Math.min(((width - MIN_WIDTH) / (MAX_WIDTH - MIN_WIDTH)) * 100, 100);
    widthFill.style.width = `${pct}%`;

    // Update active tab
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bp === bp);
    });

    // Update CSS code
    updateCSSCode(bp);

    // Update CSS panel tabs
    cssTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.bp === bp);
    });
  }

  function updateCSSCode(bp) {
    const key = bp === 'mobile' ? 'base' : bp;
    cssCode.innerHTML = CSS_CODE[key] || CSS_CODE.base;
  }

  // ===== Drag to resize =====
  let isDragging = false;
  let startX, startWidth;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startWidth = container.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + dx));
    container.style.width = newWidth + 'px';
    updateLayout();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      handle.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // Touch support
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startWidth = container.offsetWidth;
    handle.classList.add('dragging');
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + dx));
    container.style.width = newWidth + 'px';
    updateLayout();
  });

  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      handle.classList.remove('dragging');
    }
  });

  // ===== Tab click handlers =====
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const bp = btn.dataset.bp;
      const targetWidth = PRESETS[bp];
      container.style.transition = 'width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      container.style.width = targetWidth + 'px';

      // Remove transition after animation
      setTimeout(() => {
        container.style.transition = '';
        updateLayout();
      }, 520);

      // Immediate UI update
      updateLayout();
    });
  });

  // CSS panel tab click
  cssTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const bp = tab.dataset.bp;
      cssTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = bp === 'mobile' ? 'base' : bp;
      cssCode.innerHTML = CSS_CODE[key] || CSS_CODE.base;
    });
  });

  // ===== Copy CSS button =====
  const copyBtn = document.getElementById('copy-css-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      // Get plain text version of the code
      const rawCode = cssCode.textContent || cssCode.innerText;
      navigator.clipboard.writeText(rawCode).then(() => {
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      }).catch(() => {
        copyBtn.textContent = '❌ Error';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    });
  }

  // ===== Initialize =====
  container.style.width = PRESETS.desktop + 'px';
  updateLayout();

  // Watch for container resize (e.g. window resize)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => updateLayout());
    ro.observe(container);
  }
});
